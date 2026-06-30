# Entorno de Desarrollo y Ejecución

Este documento explica, paso a paso, cómo levantar el proyecto en tu máquina. Está pensado para que cualquier persona con conocimientos básicos pueda seguirlo sin complicaciones.

---

## ¿Qué necesitas tener instalado antes de empezar?

| Herramienta | Versión mínima recomendada | Para qué sirve |
|-------------|---------------------------|----------------|
| Python      | 3.11 o superior           | Correr el backend Django |
| pip         | Viene con Python          | Instalar las librerías de Python |
| Node.js     | 18 o superior             | Correr el frontend React |
| npm         | Viene con Node.js         | Instalar los paquetes de JavaScript |
| PostgreSQL  | 14 o superior             | Base de datos del proyecto |

> Si no tienes PostgreSQL instalado, puedes descargarlo desde https://www.postgresql.org/download/

---

## Parte 1 — Levantar el Backend (Django)

Todos los comandos de esta sección se ejecutan **dentro de la carpeta `BACK/`**.

### Paso 1 — Crear y activar el entorno virtual

Un entorno virtual es una caja aislada donde se instalan las librerías del proyecto sin afectar el resto de tu sistema.

```bash
# Desde la raíz del proyecto, entra a la carpeta del backend
cd BACK

# Crea el entorno virtual (se llama "venv", pero puedes cambiarlo)
python -m venv venv

# Actívalo:
# En Mac / Linux:
source venv/bin/activate

# En Windows (PowerShell):
venv\Scripts\activate
```

Cuando el entorno está activo, verás `(venv)` al inicio de tu terminal.

### Paso 2 — Instalar las dependencias

```bash
python -m pip install -r requirements.txt
```

Esto instala todo lo necesario: Django, Django REST Framework, SimpleJWT, Pillow, etc.

### Paso 3 — Configurar las variables de entorno

El proyecto usa un archivo `.env` para guardar los datos de la base de datos. Hay un archivo de ejemplo llamado `.env.example`. Cópialo y renómbralo:

```bash
# En Mac / Linux:
cp .env.example .env

# En Windows:
copy .env.example .env
```

Luego abre el archivo `.env` con cualquier editor de texto y rellena tus datos reales:

```
DB_NAME=nombre_de_tu_base_de_datos
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
```

> Asegúrate de que la base de datos indicada en `DB_NAME` ya exista en PostgreSQL. Si no, créala desde pgAdmin o con el comando `CREATE DATABASE nombre_bd;`

### Paso 4 — Aplicar las migraciones

Las migraciones crean las tablas en la base de datos a partir de los modelos del proyecto.

```bash
python manage.py migrate
```

### Paso 5 — Cargar datos de prueba (opcional pero recomendado)

El proyecto incluye un comando que carga automáticamente un usuario operador y dos boletas de ejemplo para que puedas probar el sistema de inmediato.

```bash
python manage.py seed_db
```

Esto crea:
- **Usuario operador:** RUT `12345678-9`, contraseña `1234`
- **Boleta 1:** cliente con RUT `11111111-1` (Carlos Mendoza), con 4 productos
- **Boleta 2:** cliente con RUT `22222222-2` (Ana Silva), con 2 productos

### Paso 6 — Iniciar el servidor de desarrollo

```bash
python manage.py runserver
```

El backend quedará disponible en: **http://127.0.0.1:8000**

---

## Parte 2 — Levantar el Frontend (React + Vite)

Abre una **nueva terminal** (deja el backend corriendo) y ejecuta los siguientes comandos **dentro de la carpeta `FRONT/`**.

### Paso 1 — Instalar los paquetes de Node.js

```bash
# Desde la raíz del proyecto, entra a la carpeta del frontend
cd FRONT

npm install
```

Esto descarga React, React Router, Sass y todo lo que el proyecto necesita.

### Paso 2 — Iniciar el servidor de desarrollo

```bash
npm run dev
```

El frontend quedará disponible en: **http://localhost:5173**

> El proyecto ya está configurado con un **proxy** en Vite que redirige automáticamente todas las peticiones `/api/...` hacia el backend en `http://127.0.0.1:8000`. No necesitas cambiar ninguna URL ni preocuparte por errores de CORS durante el desarrollo.

---

## Resumen rápido (ambos entornos activos al mismo tiempo)

```
Terminal 1 — Backend
────────────────────────────────────────
cd BACK
source venv/bin/activate     # (o venv\Scripts\Activate.ps1 en Windows)
python manage.py runserver


Terminal 2 — Frontend
────────────────────────────────────────
cd FRONT
npm run dev
```

Con eso, el sistema está completamente operativo y listo para usarse en el navegador.

---

## Endpoints disponibles en el Backend

| Método | URL | Descripción |
|--------|-----|-------------|
| POST | `/api/auth/login/` | Iniciar sesión con RUT y contraseña, devuelve JWT |
| POST | `/api/auth/logout/` | Cerrar sesión del operador |
| GET | `/api/dashboard/` | Estadísticas del día y listado de boletas |
| GET | `/api/boleta/?rut=XX` | Buscar boleta pendiente por RUT del cliente |
| POST | `/api/retiro/` | Registrar un nuevo retiro con productos y foto |
| GET | `/api/detalle-boleta/<id>/` | Ver el detalle completo de una boleta |
| POST | `/api/incidencia/` | Registrar una incidencia de soporte |
| GET | `/api/incidencias/` | Ver las últimas incidencias del operador |

---

## Dependencias principales

### Backend
- **Django 6.0** — Framework web principal
- **djangorestframework** — Para construir la API REST
- **djangorestframework-simplejwt** — Autenticación con tokens JWT
- **django-cors-headers** — Permite las peticiones del frontend durante el desarrollo
- **Pillow** — Manejo de imágenes (foto de respaldo del retiro)
- **psycopg2** — Conector entre Django y PostgreSQL
- **python-dotenv** — Lee las variables del archivo `.env`

### Frontend
- **React 19** — Librería de interfaz de usuario
- **React Router DOM 7** — Navegación entre páginas
- **Vite 8** — Servidor de desarrollo y empaquetado
- **Sass** — Preprocesador de estilos CSS

---

## Solución a problemas comunes

**El backend da error de base de datos al correr `migrate`:**  
Verifica que los datos en tu archivo `.env` sean correctos y que PostgreSQL esté corriendo.

**El frontend dice "Error de red" o "401 Unauthorized":**  
Asegúrate de que el backend esté corriendo en el puerto 8000 antes de usar el frontend.

**`pip install` falla con errores de compilación en psycopg2:**  
Prueba instalando la versión binaria: `pip install psycopg2-binary`

**El comando `seed_db` dice que el usuario ya existe:**  
El comando está diseñado para correr solo una vez. Si necesitas reiniciar los datos, puedes borrar la base de datos y volver a migrar.
