# SaaS Survey Platform

Plataforma full-stack para la creación y distribución de encuestas desarrollada con **Spring Boot 2 / Java 11** en el backend y **React 18 + Vite** en el frontend. Incluye autenticación JWT para administradores, CRUD completo de encuestas y recolección de respuestas con visualizaciones en tiempo real.

## Estructura del proyecto

```
.
├── backend/       # API REST con Spring Boot
└── frontend/      # SPA creada con Vite + React + Tailwind + Bootstrap
```

## Backend

### Requisitos
- Java 11
- Maven 3.8+
- PostgreSQL 13+

### Variables de entorno
Configura las credenciales de la base de datos PostgreSQL mediante variables o modificando `backend/src/main/resources/application.yml`.

```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/sbsurvey
SPRING_DATASOURCE_USERNAME=survey
SPRING_DATASOURCE_PASSWORD=survey
SECURITY_JWT_SECRET=cambia-esta-clave
```

### Ejecutar localmente

```bash
cd backend
mvn spring-boot:run
```

### Endpoints principales
- `POST /api/auth/register` – registro de usuarios administradores
- `POST /api/auth/login` – autenticación y generación de token JWT
- `GET /api/surveys` – listado de encuestas (requiere rol ADMIN)
- `POST /api/surveys` – creación de encuestas
- `GET /api/public/surveys` – listado público
- `POST /api/responses` – envío de respuestas

## Frontend

### Requisitos
- Node.js 18+
- npm 9+

### Instalación y ejecución

```bash
cd frontend
npm install
npm run dev
```

La aplicación se sirve en `http://localhost:5173` y proxifica las peticiones `/api` hacia `http://localhost:8080`.

## Scripts útiles

| Comando | Descripción |
| --- | --- |
| `npm run lint` | Linter de React (ESLint) |
| `mvn test` | Ejecuta las pruebas del backend |

## Pruebas

### Backend (Spring Boot)
1. Verifica tener Java 11 y Maven instalados, tal como se describe en la sección de requisitos.
2. Desde la carpeta `backend/`, ejecuta:
   ```bash
   mvn test
   ```
   Este comando levanta el contexto de Spring usando un perfil `test` que utiliza una base de datos en memoria **H2** (no necesitas tener PostgreSQL activo para los tests) y valida que la aplicación arranca correctamente.
3. Para ejecutar una clase de prueba específica puedes usar:
   ```bash
   mvn -Dtest=SurveyApplicationTests test
   ```

### Frontend (React)
Actualmente no hay pruebas automatizadas implementadas. Como verificación rápida puedes ejecutar el linter:
```bash
cd frontend
npm run lint
```
En próximas iteraciones se pueden añadir pruebas con Vitest/React Testing Library.

## Próximos pasos
- Añadir pruebas unitarias y de integración adicionales.
- Implementar gestión avanzada de roles/permisos y dashboards más completos.
- Configurar CI/CD y despliegues con Docker Compose.
