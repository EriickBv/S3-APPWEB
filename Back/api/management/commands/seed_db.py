from django.core.management.base import BaseCommand
from api.models import Usuario, Boleta, Producto


class Command(BaseCommand):
    help = 'Crea datos de prueba: un operador y boletas de cliente'

    def handle(self, *args, **kwargs):
        if not Usuario.objects.filter(rut='12345678-9').exists():
            Usuario.objects.create_user(
                username='operador1',
                password='1234',
                rut='12345678-9',
                rol='OPERADOR',
                first_name='Juan',
                last_name='Pérez',
            )
            self.stdout.write(self.style.SUCCESS('Operador creado: rut=12345678-9, pass=1234'))
        else:
            self.stdout.write('El operador ya existe.')

        if not Boleta.objects.exists():
            boleta1 = Boleta.objects.create(
                rut_cliente='11111111-1',
                nombre_cliente='Carlos Mendoza',
                estado='PENDIENTE_RETIRO',
            )
            Producto.objects.create(boleta=boleta1, nombre='Monitor 24"', categoria='Electrónica')
            Producto.objects.create(boleta=boleta1, nombre='Teclado Mecánico', categoria='Accesorios')
            Producto.objects.create(boleta=boleta1, nombre='Mouse Inalámbrico', categoria='Accesorios')
            Producto.objects.create(boleta=boleta1, nombre='Cable HDMI 2m', categoria='Cables')

            boleta2 = Boleta.objects.create(
                rut_cliente='22222222-2',
                nombre_cliente='Ana Silva',
                estado='PENDIENTE_RETIRO',
            )
            Producto.objects.create(boleta=boleta2, nombre='Audífonos Gamer', categoria='Electrónica')
            Producto.objects.create(boleta=boleta2, nombre='Mousepad XL', categoria='Accesorios')

            self.stdout.write(self.style.SUCCESS('Boletas de prueba creadas.'))
            self.stdout.write('  RUT cliente 1: 11111111-1 (Carlos Mendoza)')
            self.stdout.write('  RUT cliente 2: 22222222-2 (Ana Silva)')
        else:
            self.stdout.write('Ya existen boletas en la base de datos.')
