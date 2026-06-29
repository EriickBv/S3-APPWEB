from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('boleta/', views.buscar_boleta, name='buscar-boleta'),
    path('retiro/', views.procesar_retiro, name='procesar-retiro'),
    path('detalle-boleta/<int:boleta_id>/', views.detalle_boleta, name='detalle-boleta'),
    path('incidencia/', views.crear_incidencia, name='crear-incidencia'),
    path('incidencias/', views.listar_incidencias, name='listar-incidencias'),
]
