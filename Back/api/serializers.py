from rest_framework import serializers
from .models import Usuario, Boleta, Producto, Retiro, Incidencia


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'rut', 'rol']


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'categoria', 'imagen_referencial', 'estado_entrega']


class BoletaSerializer(serializers.ModelSerializer):
    productos = ProductoSerializer(many=True, read_only=True)

    class Meta:
        model = Boleta
        fields = ['id', 'rut_cliente', 'nombre_cliente', 'estado', 'fecha_compra', 'productos']


class RetiroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Retiro
        fields = ['id', 'boleta', 'operador', 'timestamp', 'estado', 'foto_respaldo', 'es_tercero']
        read_only_fields = ['operador', 'timestamp']


class IncidenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incidencia
        fields = [
            'id', 'operador', 'retiro_asociado', 'id_sede',
            'descripcion', 'nivel_urgencia', 'estado', 'timestamp'
        ]
        read_only_fields = ['operador', 'estado', 'timestamp']
        extra_kwargs = {
            'retiro_asociado': {'required': False, 'allow_null': True},
        }
