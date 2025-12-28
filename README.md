# 🚲 Sistema de Gestión de Bicicleteros (ICINF)

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-Private-red)

Sistema integral y moderno para la gestión inteligente, monitoreo en tiempo real y control de acceso de los bicicleteros universitarios.

---

## 🚀 Descripción

Este proyecto implementa una solución completa (**Full Stack**) para administrar la seguridad y disponibilidad de espacios para bicicletas. Utiliza tecnologías de vanguardia para asegurar una experiencia fluida tanto para los guardias de seguridad como para los administradores y usuarios.

### ✨ Características Destacadas

*   **📊 Dashboard en Tiempo Real:** Visualización de ocupación y estadísticas con actualizaciones instantáneas (WebSockets).
*   **🛡️ Control de Acceso Granular:** Sistema de roles (Guardia, Dueño, Central) con rutas protegidas y autenticación JWT.
*   **🗺️ Mapas Interactivos:** Integración con Leaflet para gestión geoespacial de ubicaciones.
*   **📱 Diseño Responsivo:** Interfaz moderna construida con React y TailwindCSS.

---

## 🛠 Tech Stack

### Backend
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ⚙️ Configuración del Entorno

Para desplegar el proyecto correctamente, asegúrate de configurar las variables de entorno con los siguientes valores oficiales.

### 🔌 Backend (`Backend/.env`)

Crea un archivo `.env` en la carpeta `Backend/` y pega la siguiente configuración:

```ini
# --- Servidor ---
HOST=146.83.198.35
PORT=80
FRONTEND_URL='http://146.83.198.35:1354/'

# --- Base de Datos ---
DB_USERNAME="Nombre de usuario"
DB_PASSWORD="Contraseña"
DATABASE="Nombre de la base de datos"
DB_PORT="Puerto"

# --- Seguridad ---
HSH_VALUE=10
SECRET_JWT_KEY='tu_clave_secreta_jwt_aqui'
JWT_EXPIRES_IN='1h'

# --- Credenciales Central & Correo ---
EMAIL_USER="correo@ejemplo.com"
EMAIL_PASS="clave_aplicacion_correo"
PASS="password_central"
RUT_CENTRAL="12.345.678-9"
TELEFONO_CENTRAL="+56912345678"
```

### 💻 Frontend (`Frontend/.env`)

Crea un archivo `.env` en la carpeta `Frontend/` con la siguiente configuración:

```ini
# --- API Connection ---
VITE_API_URL=http://146.83.198.35:1353/api
VITE_BACKEND_URL=http://146.83.198.35:1353/
```

> **Nota:** Asegúrate de que los puertos `1353` (Backend API) y `1354` (Frontend) estén expuestos y accesibles si estás desplegando en el servidor `146.83.198.35`.

---

## 📦 Instalación y Despliegue

Sigue estos pasos para levantar el entorno de desarrollo:

1.  **Instalar Dependencias:**
    ```bash
    # Backend
    cd Backend
    npm install

    # Frontend
    cd ../Frontend
    npm install
    ```

2.  **Iniciar Servicios:**

    *Terminal 1 (Backend):*
    ```bash
    cd Backend
    npm run dev
    ```

    *Terminal 2 (Frontend):*
    ```bash
    cd Frontend
    npm run dev
    ```

---

## � Colaboradores

Desarrollado con ❤️ por el equipo de PeppaCode.

*   **SebaDyK1ng** - sebastian.fernandez2201@alumnos.ubiobio.cl
*   **JeanMunozV** - jean.munoz2201@alumnos.ubiobio.cl
*   **Benjaaaaa09** - benjamin.escobar2201@alumnos.ubiobio.cl
*   **Neeidaan** - neidan.martinez2201@alumnos.ubiobio.cl
