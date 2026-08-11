# Green Acres — Frontend

Frontend de **Green Acres**, una plataforma web integral para la gestión de un club cannábico en Uruguay.

El sistema fue desarrollado como **Proyecto Integrador de la carrera Analista en Tecnologías de la Información de Universidad ORT Uruguay durante 2026**, abordando el ciclo completo de construcción de software: análisis funcional, diseño UX/UI, desarrollo Full Stack, integración con APIs, testing, documentación y despliegue en la nube.

Este repositorio contiene la interfaz web utilizada por administradores y socios de la plataforma.

## Estado del proyecto

**Proyecto finalizado y desplegado.**

La aplicación fue implementada y validada tanto en entorno local como en infraestructura AWS.

El frontend forma parte de una arquitectura desplegada mediante:

- Amazon EC2 para la ejecución de la aplicación.
- Nginx como reverse proxy.
- Amazon RDS con PostgreSQL utilizado por el backend.
- Amazon S3 para almacenamiento de imágenes de productos.
- Variables de entorno para configuración según el entorno.

> El entorno cloud corresponde al despliegue académico del proyecto y puede no encontrarse disponible permanentemente.

---

## Tecnologías principales

- Next.js 16
- React 19
- TypeScript
- Material UI 9
- Emotion
- Next.js App Router
- Fetch API
- REST APIs
- JWT
- FormData / multipart
- Responsive Design
- Git / GitHub
- Amazon EC2
- Amazon S3

---

## Arquitectura frontend

El frontend aplica una separación de responsabilidades que evita concentrar lógica de negocio, comunicación HTTP y presentación dentro de las páginas.

El flujo principal utilizado por los módulos es:

```text
Page
  ↓
Container
  ↓
Hook
  ↓
API Layer
  ↓
httpClient
  ↓
Backend REST API
```

### Page

Define la ruta dentro de Next.js y delega la funcionalidad al container correspondiente.

### Container

Coordina el comportamiento de la pantalla y conecta la interfaz con los hooks del dominio.

### Hook

Administra estado, carga de información, acciones, errores y comportamiento específico del módulo.

### API Layer

Define los contratos y operaciones disponibles contra el backend.

### httpClient

Centraliza la comunicación HTTP de toda la aplicación.

Entre sus responsabilidades se encuentran:

- Configuración de la URL base.
- Incorporación automática del JWT.
- Serialización JSON.
- Soporte de `FormData`.
- Manejo de respuestas vacías.
- Manejo centralizado de errores.
- Conservación de códigos funcionales enviados por backend.
- Detección de sesiones no autorizadas.
- Limpieza de sesión cuando corresponde.

---

## Organización principal

La solución se encuentra organizada en responsabilidades diferenciadas:

```text
src/
├── app/
├── api/
├── containers/
├── features/
├── hooks/
├── layouts/
├── providers/
└── components/
```

Esta estructura permite mantener separadas:

- rutas;
- presentación;
- lógica de interfaz;
- acceso a APIs;
- autenticación;
- estado compartido;
- componentes reutilizables;
- layouts.

---

## Autenticación y seguridad

El frontend implementa los distintos flujos de autenticación requeridos por el backend.

Entre ellos:

- Inicio de sesión.
- Persistencia controlada de sesión.
- JWT.
- Cierre de sesión.
- Restauración de sesión.
- Protección de rutas.
- Autorización según rol.
- Manejo de sesión expirada.
- Cambio obligatorio de contraseña temporal.
- Recuperación de contraseña.
- Restablecimiento de contraseña.
- Consentimiento informado.

La aplicación distingue entre los roles:

```text
ADMIN
SOCIO
```

y redirige a cada usuario hacia el entorno correspondiente.

---

## Multi-Factor Authentication

El flujo administrativo contempla autenticación multifactor mediante TOTP.

La interfaz soporta:

- Detección de login que requiere MFA.
- Almacenamiento temporal del challenge.
- Pantalla independiente de verificación.
- Ingreso del código TOTP.
- Configuración posterior de MFA.
- Confirmación de configuración.
- Manejo de códigos de recuperación.
- Estados de error y expiración del challenge.

Los desafíos MFA se mantienen separados de una sesión autenticada normal.

---

## Gestión global de sesión

La aplicación utiliza un provider de autenticación encargado de mantener:

- Usuario autenticado.
- Token.
- Estado de restauración de sesión.
- Inicio de sesión.
- Actualización del usuario.
- Cierre de sesión.

La restauración se realiza del lado cliente para mantener compatibilidad con el modelo de renderizado de Next.js y evitar inconsistencias de hidratación.

---

# Portal Administrativo

El portal administrativo centraliza la operación interna de Green Acres.

Su navegación incluye los siguientes módulos.

## Dashboard

Pantalla principal del administrador con información operativa y accesos a los principales dominios del sistema.

---

## Productos

Permite administrar el catálogo disponible.

Incluye:

- Listado.
- Alta.
- Edición.
- Cambio de estado.
- Información de flores y semillas.
- Genética.
- THC.
- Precios.
- Imágenes.
- Integración con Amazon S3.

### Gestión de imágenes

La interfaz soporta carga de imágenes mediante `multipart/form-data`.

Incluye:

- Selección local.
- Preview.
- Validación del archivo.
- JPG.
- PNG.
- WEBP.
- Tamaño máximo controlado.
- Reemplazo de imágenes existentes.
- Conservación de la imagen actual cuando no se selecciona una nueva.

---

## Stock

Permite visualizar y operar sobre la información de inventario administrada por el backend.

El frontend presenta de forma diferenciada la información relacionada con:

- Stock total.
- Stock reservado.
- Stock disponible.
- Movimientos de inventario.

---

## Ventas

Interfaz administrativa para consultar y gestionar ventas.

Permite trabajar con información relacionada con:

- Socio.
- Productos.
- Cantidades.
- Importes.
- Estado.
- Detalle.
- Anulación cuando la operación lo permite.

---

## Reservas

El módulo administrativo permite visualizar y gestionar el ciclo de vida de las reservas.

Incluye:

- Listado.
- Búsqueda.
- Filtros.
- Detalle.
- Estados.
- Cancelación.
- Confirmación de retiro.
- Información del socio.
- Productos reservados.
- Fechas relevantes.
- Historial asociado.

---

## Socios

Permite administrar los socios registrados en Green Acres.

Incluye:

- Listado.
- Búsqueda.
- Filtros.
- Alta.
- Edición.
- Cambio de estado.
- Detalle.
- Estados `ACTIVO`, `INACTIVO` y `SUSPENDIDO`.

La interfaz refleja las reglas de negocio definidas por el backend para cada transición.

---

## Proveedores

Interfaz para la administración de proveedores.

Incluye:

- Listado.
- Alta.
- Edición.
- Cambio de estado.
- Datos de contacto.
- Consulta de información asociada.

---

## Compras

Permite registrar y consultar operaciones de compra.

Incluye:

- Selección de proveedor.
- Productos.
- Cantidades.
- Costos.
- Detalle.
- Información histórica.

El frontend se integra con las reglas transaccionales de inventario implementadas en backend.

---

## Novedades

Permite administrar comunicaciones institucionales destinadas al Portal del Socio.

Incluye:

- Alta.
- Edición.
- Activación.
- Inactivación.
- Consulta.

Las novedades activas pueden ser visualizadas posteriormente por los socios.

---

# Portal del Socio

Green Acres incluye un entorno independiente destinado a los socios del club.

Su navegación está diseñada específicamente para las operaciones permitidas a este rol.

---

## Mi perfil

La pantalla principal del socio presenta su información personal y los datos relevantes de su relación con el club.

También refleja información vinculada con las reglas de consumo mensual administradas por el backend.

---

## Mis reservas

Permite al socio consultar:

- Reservas activas.
- Historial.
- Estado.
- Productos.
- Cantidades.
- Fechas.
- Fecha límite de retiro.
- Detalle de cada operación.

---

## Productos disponibles

El socio puede consultar los productos habilitados para reserva.

Desde este flujo puede:

- Explorar productos disponibles.
- Consultar sus características.
- Visualizar imágenes.
- Seleccionar cantidades.
- Crear una nueva reserva.

La validación definitiva de stock y reglas de negocio permanece centralizada en el backend.

---

## Novedades

El Portal del Socio permite consultar las novedades activas publicadas por la administración.

---

## Consentimiento informado

Green Acres incorpora un flujo específico de consentimiento informado.

Cuando un socio todavía no completó este requisito, la aplicación restringe el acceso al resto de las funcionalidades correspondientes y lo dirige al flujo necesario para aceptarlo.

Una vez completado, la sesión actualiza su estado y permite continuar utilizando el portal.

---

## Diseño responsive

La interfaz fue desarrollada considerando distintos tamaños de pantalla.

Los layouts autenticados comparten una estructura reutilizable y adaptativa para:

- Desktop.
- Tablet.
- Mobile.

La navegación modifica su comportamiento según el espacio disponible y mantiene separadas las opciones correspondientes a cada rol.

---

## UX/UI

Durante el desarrollo se trabajó sobre:

- Consistencia visual entre módulos.
- Jerarquía de información.
- Estados de carga.
- Estados vacíos.
- Mensajes de error.
- Feedback de acciones.
- Confirmaciones.
- Formularios.
- Validaciones.
- Navegación contextual.
- Diseño responsive.
- Accesibilidad mediante labels y atributos ARIA.
- Prevención de acciones duplicadas durante operaciones en curso.

Material UI es utilizado como base del sistema visual y de los componentes de interfaz.

---

## Manejo de errores

El frontend utiliza un error HTTP tipado común para conservar:

```text
status
code
message
```

enviados por el backend.

Esto permite resolver comportamientos funcionales sin depender únicamente de comparar textos.

Entre los flujos que pueden diferenciarse de esta forma se encuentran:

- Sesión expirada.
- MFA.
- Contraseña temporal.
- Consentimiento pendiente.
- Errores de validación.
- Errores de reglas de negocio.

---

## Integración con la API

La URL del backend se configura mediante:

```text
NEXT_PUBLIC_API_URL
```

El repositorio incluye:

```text
.env.example
```

con una configuración local de ejemplo.

Por defecto, durante desarrollo:

```text
http://localhost:8080
```

La aplicación no almacena secretos de infraestructura dentro del código fuente.

---

## Instalación local

### Requisitos

- Node.js.
- npm.
- Backend de Green Acres disponible.

### 1. Clonar el repositorio

```bash
git clone https://github.com/MauroGiaccobasso-Git/green-acress-frontend.git
cd green-acress-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar el entorno

Crear:

```text
.env.local
```

tomando como referencia:

```text
.env.example
```

Ejemplo:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Por defecto:

```text
http://localhost:3000
```

---

## Scripts principales

### Desarrollo

```bash
npm run dev
```

### Build de producción

```bash
npm run build
```

### Ejecución de producción

```bash
npm start
```

### Análisis estático

```bash
npm run lint
```

---

## Validación del frontend

Durante el desarrollo se validaron los cambios mediante:

- ESLint.
- TypeScript.
- Builds de producción.
- Pruebas funcionales.
- Pruebas de integración frontend/backend.
- Validación responsive.
- Validación de flujos administrativos.
- Validación del Portal del Socio.
- Validación de autenticación y MFA.
- Validación del manejo de imágenes con Amazon S3.

---

## Repositorio Backend

La API REST y la lógica de negocio de Green Acres se encuentran en un repositorio independiente:

https://github.com/MauroGiaccobasso-Git/green-acress-backend

El backend fue desarrollado con Node.js, Express.js, PostgreSQL y Prisma ORM.

---

## Proyecto académico

Green Acres fue desarrollado como Proyecto Integrador de la carrera **Analista en Tecnologías de la Información — Universidad ORT Uruguay, 2026**.

El proyecto abarca análisis funcional, diseño UX/UI, desarrollo Full Stack, integración mediante APIs REST, persistencia de datos, seguridad, testing, documentación técnica y despliegue cloud.