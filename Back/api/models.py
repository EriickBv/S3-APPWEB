from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    rut = models.CharField(max_length=12, unique=True)
    ROLES = (
        ('OPERADOR', 'Operador'),
#        ('SOPORTE', 'Soporte'),
    )
    rol = models.CharField(max_length=20, choices=ROLES)
    estado_sesion = models.BooleanField(default=False)
    groups = models.ManyToManyField('auth.Group', related_name='api_usuario_groups', blank=True)
    user_permissions = models.ManyToManyField('auth.Permission', related_name='api_usuario_permissions', blank=True)

    def __str__(self):
        return f"{self.username} - {self.rol}"

class Boleta(models.Model):
    ESTADOS = (('PENDIENTE_RETIRO', 'Pendiente Retiro'), ('RETIRADA', 'Retirada'))
    rut_cliente = models.CharField(max_length=12)
    nombre_cliente = models.CharField(max_length=100)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='PENDIENTE_RETIRO')
    fecha_compra = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Boleta {self.id} - {self.rut_cliente}"

class Producto(models.Model):
    ESTADOS = (('PENDIENTE', 'Pendiente'), ('ENTREGADO', 'Entregado'), ('CON_PROBLEMA', 'Con Problema'))
    boleta = models.ForeignKey(Boleta, on_delete=models.CASCADE, related_name='productos')
    nombre = models.CharField(max_length=100)
    categoria = models.CharField(max_length=50)
    imagen_referencial = models.ImageField(upload_to='productos/', blank=True, null=True)
    estado_entrega = models.CharField(max_length=20, choices=ESTADOS, default='PENDIENTE')

    def __str__(self):
        return self.nombre

class Retiro(models.Model):
    ESTADOS = (('COMPLETADO', 'Completado'), ('RECHAZADO', 'Rechazado'))
    boleta = models.OneToOneField(Boleta, on_delete=models.CASCADE)
    operador = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, limit_choices_to={'rol': 'OPERADOR'})
    timestamp = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADOS)
    foto_respaldo = models.ImageField(upload_to='evidencia_retiros/', blank=True, null=True)
    es_tercero = models.BooleanField(default=False)

    def __str__(self):
        return f"Retiro de Boleta {self.boleta.id}"

class Incidencia(models.Model):
    URGENCIAS = (('BAJA', 'Baja'), ('MEDIA', 'Media'), ('ALTA', 'Alta'))
    ESTADOS = (('ABIERTO', 'Abierto'), ('EN_PROCESO', 'En Proceso'), ('CERRADO', 'Cerrado'))
    operador = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='incidencias_creadas')
    retiro_asociado = models.ForeignKey(Retiro, on_delete=models.SET_NULL, null=True, blank=True, related_name='incidencias')
    id_sede = models.CharField(max_length=50)
    descripcion = models.TextField()
    nivel_urgencia = models.CharField(max_length=10, choices=URGENCIAS)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='ABIERTO')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Incidencia {self.id} - Urgencia: {self.nivel_urgencia}"