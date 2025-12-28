# IES El Caminas - Portal Académico (Aules1)

Este proyecto es una aplicación web progresiva (SPA) desarrollada con React para la gestión académica del ciclo de Desarrollo de Aplicaciones Multiplataforma. Está configurada para ser desplegada en el entorno de producción `aules1`.

## 🚀 Despliegue en Producción

### Requisitos del Servidor
- Servidor web estático (Apache, Nginx, Vercel, Netlify, o Hosting compartido).
- No requiere base de datos SQL/NoSQL (utiliza almacenamiento local persistente en el navegador para esta versión).

### Instrucciones de Instalación
1. **Compilación**: Si se utiliza un bundler, ejecutar `npm run build`.
2. **Subida**: Subir el contenido de la carpeta resultante al directorio `/aules1` de su servidor web.
3. **Rutas**: La aplicación utiliza `HashRouter` (ej. `dominio.com/aules1/#/login`). Esto garantiza compatibilidad total con subcarpetas sin necesidad de configurar reescritura de URLs (mod_rewrite) en el servidor.

---

## 🔑 Credenciales de Acceso (Entorno de Pruebas)

Utilice las siguientes credenciales para verificar la funcionalidad de los diferentes roles.

### 👨‍💼 Administrador
Acceso total a gestión de alumnos, notas, asistencia y mensajería global.
- **Usuario:** `admin`
- **Contraseña:** `admin123`

### 👨‍🏫 Docente
Acceso a mensajería con alumnos.
- **Usuario:** `ana.garcia`
- **Contraseña:** `ana123`

### 👨‍🎓 Alumnos (Datos curso 2025-2026)
Acceso a consulta de notas, perfil (sin foto) y contacto con profesores.

**Alumno 1:**
- **Usuario:** `imad.elghoufairi`
- **Contraseña:** `imad123`
- **NIA:** `2984619`

**Alumno 2:**
- **Usuario:** `walid.taibi`
- **Contraseña:** `walid123`
- **NIA:** `1209362`

---

## 🛠️ Características Técnicas

- **Frontend**: React 19 + TypeScript.
- **Estilos**: Tailwind CSS (CDN para prototipado rápido).
- **Iconografía**: Lucide React.
- **Gráficos**: Recharts.
- **Persistencia**: LocalStorage (simula Base de Datos persistente por navegador).
- **Seguridad**:
    - Rutas protegidas por Roles (`ProtectedRoute`).
    - Saneamiento de objetos de usuario (las contraseñas no se mantienen en el estado global).
    - Diseño sin cookies de sesión de servidor (Stateless Client).

## 🗂️ Estructura de Datos

El sistema gestiona las siguientes entidades principales:
1. **Usuarios**: Admin, Profesores, Alumnos (campos: ID, nombre, usuario, rol, datos académicos).
2. **Asignaturas**: Módulos del ciclo DAM.
3. **Calificaciones**: Notas divididas por semestre (1º y 2º).
4. **Asistencia**: Contador de horas de falta.
5. **Mensajería**: Sistema interno de tickets/mensajes.

---

**© 2025 Generalitat Valenciana - Conselleria d'Educació**
*IES El Caminas - Proyecto Educativo*
