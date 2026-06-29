from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Boleta, Producto, Retiro, Incidencia


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ['username', 'rut', 'rol', 'estado_sesion', 'is_active']
    list_filter = ['rol', 'estado_sesion']
    fieldsets = UserAdmin.fieldsets + (
        ('Datos del operador', {'fields': ('rut', 'rol', 'estado_sesion')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Datos del operador', {'fields': ('rut', 'rol')}),
    )


@admin.register(Boleta)
class BoletaAdmin(admin.ModelAdmin):
    list_display = ['id', 'rut_cliente', 'nombre_cliente', 'estado', 'fecha_compra']
    list_filter = ['estado']
    search_fields = ['rut_cliente', 'nombre_cliente']


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'categoria', 'estado_entrega', 'boleta']
    list_filter = ['estado_entrega', 'categoria']


@admin.register(Retiro)
class RetiroAdmin(admin.ModelAdmin):
    list_display = ['id', 'boleta', 'operador', 'estado', 'es_tercero', 'timestamp']
    list_filter = ['estado', 'es_tercero']


@admin.register(Incidencia)
class IncidenciaAdmin(admin.ModelAdmin):
    list_display = ['id', 'operador', 'nivel_urgencia', 'estado', 'timestamp']
    list_filter = ['nivel_urgencia', 'estado']
