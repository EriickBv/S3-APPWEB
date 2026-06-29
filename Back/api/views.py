import json
from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Boleta, Incidencia, Producto, Retiro
from .serializers import BoletaSerializer, IncidenciaSerializer, RetiroSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    rut = request.data.get('rut', '').strip()
    password = request.data.get('password', '')

    if not rut or not password:
        return Response(
            {'error': 'RUT y contraseña son requeridos'},
            status=status.HTTP_400_BAD_REQUEST
        )

    from .models import Usuario
    try:
        usuario = Usuario.objects.get(rut=rut)
    except Usuario.DoesNotExist:
        return Response(
            {'error': 'RUT o contraseña incorrectos'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    user = authenticate(request, username=usuario.username, password=password)
    if user is None:
        return Response(
            {'error': 'RUT o contraseña incorrectos'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    usuario.estado_sesion = True
    usuario.save(update_fields=['estado_sesion'])

    refresh = RefreshToken.for_user(user)

    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'usuario': {
            'id': user.id,
            'nombre': user.get_full_name() or user.username,
            'rut': usuario.rut,
            'rol': usuario.rol,
            'sede': 'Sede Central',
        }
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        request.user.estado_sesion = False
        request.user.save(update_fields=['estado_sesion'])
    except Exception:
        pass
    return Response({'mensaje': 'Sesión cerrada correctamente'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_view(request):
    hoy = timezone.localdate()
    retiros_hoy = Retiro.objects.filter(timestamp__date=hoy)

    entregados = retiros_hoy.filter(estado='COMPLETADO').count()
    rechazados = retiros_hoy.filter(estado='RECHAZADO').count()
    pendientes = Boleta.objects.filter(estado='PENDIENTE_RETIRO').count()

    boletas = (
        Boleta.objects
        .prefetch_related('productos')
        .order_by('-fecha_compra')[:20]
    )

    lista_boletas = []
    for boleta in boletas:
        primer_producto = boleta.productos.first()

        if boleta.estado == 'RETIRADA':
            try:
                retiro = Retiro.objects.get(boleta=boleta)
                estado_display = retiro.estado.lower()
            except Retiro.DoesNotExist:
                estado_display = 'entregado'
        else:
            estado_display = 'pendiente'

        lista_boletas.append({
            'id': f'BOL-{boleta.id:05d}',
            'boleta_db_id': boleta.id,
            'producto': primer_producto.nombre if primer_producto else 'Sin productos',
            'cantidad': boleta.productos.count(),
            'cliente': boleta.nombre_cliente,
            'estado': estado_display,
        })

    return Response({
        'stats': {
            'entregados': entregados,
            'pendientes': pendientes,
            'rechazados': rechazados,
        },
        'boletas': lista_boletas,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def buscar_boleta(request):
    rut = request.query_params.get('rut', '').strip()

    if not rut:
        return Response(
            {'error': 'El parámetro RUT es requerido'},
            status=status.HTTP_400_BAD_REQUEST
        )

    boleta = (
        Boleta.objects
        .filter(rut_cliente=rut, estado='PENDIENTE_RETIRO')
        .prefetch_related('productos')
        .order_by('-fecha_compra')
        .first()
    )

    if boleta is None:
        return Response(
            {'error': 'El RUT ingresado no registra retiros pendientes'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = BoletaSerializer(boleta)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def procesar_retiro(request):
    boleta_id = request.data.get('boleta_id')
    es_tercero_raw = request.data.get('es_tercero', 'false')
    foto_respaldo = request.FILES.get('foto_respaldo')
    productos_raw = request.data.get('productos', '[]')

    if not boleta_id:
        return Response(
            {'error': 'El ID de boleta es requerido'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        boleta = Boleta.objects.get(id=boleta_id, estado='PENDIENTE_RETIRO')
    except Boleta.DoesNotExist:
        return Response(
            {'error': 'Boleta no encontrada o ya fue procesada'},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        productos_estados = json.loads(productos_raw) if isinstance(productos_raw, str) else productos_raw
    except (json.JSONDecodeError, TypeError):
        productos_estados = []

    for p_data in productos_estados:
        try:
            producto = Producto.objects.get(id=p_data.get('id'), boleta=boleta)
            nuevo_estado = p_data.get('estado_entrega', 'PENDIENTE')
            if nuevo_estado in ('PENDIENTE', 'ENTREGADO', 'CON_PROBLEMA'):
                producto.estado_entrega = nuevo_estado
                producto.save(update_fields=['estado_entrega'])
        except Producto.DoesNotExist:
            pass

    hay_problemas = any(p.get('estado_entrega') == 'CON_PROBLEMA' for p in productos_estados)
    es_tercero = str(es_tercero_raw).lower() in ('true', '1', 'yes')
    estado_retiro = 'RECHAZADO' if hay_problemas else 'COMPLETADO'

    retiro = Retiro(
        boleta=boleta,
        operador=request.user,
        estado=estado_retiro,
        es_tercero=es_tercero,
    )
    if foto_respaldo:
        retiro.foto_respaldo = foto_respaldo
    retiro.save()

    boleta.estado = 'RETIRADA'
    boleta.save(update_fields=['estado'])

    serializer = RetiroSerializer(retiro)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detalle_boleta(request, boleta_id):
    try:
        boleta = Boleta.objects.prefetch_related('productos').get(id=boleta_id)
    except Boleta.DoesNotExist:
        return Response({'error': 'Boleta no encontrada'}, status=status.HTTP_404_NOT_FOUND)

    retiro = None
    try:
        retiro = Retiro.objects.select_related('operador').get(boleta=boleta)
    except Retiro.DoesNotExist:
        pass

    productos_data = []
    for p in boleta.productos.all():
        productos_data.append({
            'id': p.id,
            'codigo': f'SKU-{p.id:03d}',
            'nombre': p.nombre,
            'categoria': p.categoria,
            'entregado': p.estado_entrega == 'ENTREGADO',
            'causa': 'Con problema' if p.estado_entrega == 'CON_PROBLEMA' else None,
        })

    todos_entregados = all(p['entregado'] for p in productos_data)
    hay_problema = any(p['causa'] for p in productos_data)

    if todos_entregados:
        estado_display = 'Retirado'
    elif hay_problema:
        estado_display = 'Retirado parcialmente'
    else:
        estado_display = 'Pendiente'

    nombre_operador = 'Sin asignar'
    if retiro and retiro.operador:
        nombre_operador = retiro.operador.get_full_name() or retiro.operador.username

    fecha_ref = retiro.timestamp if retiro else boleta.fecha_compra
    foto_url = None
    if retiro and retiro.foto_respaldo:
        foto_url = request.build_absolute_uri(retiro.foto_respaldo.url)

    return Response({
        'estado_general': estado_display,
        'info_basica': {
            'cliente': boleta.nombre_cliente,
            'sede': 'Sede Central',
            'boleta_id': f'BOL-{boleta.id:05d}',
            'fecha': fecha_ref.strftime('%d-%m-%Y'),
            'hora': fecha_ref.strftime('%H:%M'),
            'operador': nombre_operador,
        },
        'productos': productos_data,
        'foto_respaldo': foto_url,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_incidencia(request):
    datos = {
        'id_sede': request.data.get('id_sede', 'Sede Central'),
        'descripcion': request.data.get('descripcion', ''),
        'nivel_urgencia': request.data.get('nivel_urgencia', 'BAJA'),
        'retiro_asociado': request.data.get('retiro_asociado', None),
    }

    serializer = IncidenciaSerializer(data=datos)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    serializer.save(operador=request.user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_incidencias(request):
    incidencias = (
        Incidencia.objects
        .filter(operador=request.user)
        .order_by('-timestamp')[:10]
    )

    data = [
        {
            'id': inc.id,
            'fecha': inc.timestamp.strftime('%d/%m %H:%M'),
            'descripcion': inc.descripcion[:40] + ('...' if len(inc.descripcion) > 40 else ''),
            'estado': inc.get_estado_display(),
        }
        for inc in incidencias
    ]

    return Response(data)
