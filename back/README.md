# Backend de Cryptex

Backend en Express + Socket.io para Cryptex. Provee autenticacion, APIs de usuarios/chat y canales de mensajeria en tiempo real.

## Stack

- Node.js (ES Modules)
- Express 5
- Socket.io
- PostgreSQL (`pg`)
- JWT + autenticacion basada en cookies
- pnpm (gestor de paquetes requerido)

## Requisitos

- Node.js 20+
- pnpm 10+
- Docker + Docker Compose (opcional, para infraestructura local)

## Inicio rapido

1. Instalar dependencias:

```bash
pnpm install
```

2. Configurar variables de entorno (crear/actualizar `.env`).

3. (Opcional) Levantar servicios de infraestructura local:

```bash
docker-compose up -d
```

4. Iniciar backend en modo desarrollo:

```bash
pnpm run dev
```

El servidor API se ejecuta con `node --watch ./src/index.js`.

## Scripts disponibles

- `pnpm run dev`: Inicia el backend con recarga por cambios
- `pnpm run start`: Inicia el backend una sola vez

## Variables de entorno

Como minimo, configurar:

```env
APP_PORT=3000
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_USER=your_user
DB_PASS=your_password
DB_DATABASE=your_database

JWT_SECRET=replace_with_a_strong_secret

LDAP_URL=ldap://your-ldap-server/
DOMAIN_FQDN=your.domain

MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
MINIO_BUCKET=your_bucket
```

Notas:

- `APP_PORT` debe coincidir con lo esperado por el proxy del frontend (`front/vite.config.js` normalmente apunta a `http://localhost:3000`).
- No subir credenciales/secretos reales al repositorio.

## Estructura del proyecto

```text
src/
  core/
    config/        # conexion de env/config
    database/      # pool de PostgreSQL y chequeos de conexion
    minio/         # helper de conexion a MinIO
    rabbitmq/      # cliente/consumer de RabbitMQ (no totalmente conectado)
    redis/         # cliente de Redis (no totalmente conectado)
  modules/
    auth/          # login, validacion de token, usuario actual
    users/         # listado/busqueda de usuarios
    chat/          # historial de chat + endpoint de usuarios online
    socketio/      # handlers de sockets en tiempo real
    media/         # upload/servicio de media (en progreso)
  index.js         # bootstrap de Express + HTTP/Socket
```

## HTTP API (rutas actuales)

URL base: `http://localhost:<APP_PORT>`

- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/token`
- `POST /users/getUsersWithRol` (requiere cookie de auth)
- `POST /users/getUsers` (requiere cookie de auth)
- `POST /chat/getChatHistory` (requiere cookie de auth)
- `POST /chat/getOnlineUsers` (requiere cookie de auth)

La autenticacion se maneja mediante la cookie HTTP-only `access_cookie`.

## Socket.io

El servidor de sockets esta adjunto al mismo servidor HTTP.

El cliente debe enviar token al conectarse:

```js
const socket = io("http://localhost:3000", {
  auth: { token: "<jwt>" },
});
```

Eventos actuales del lado del servidor:

- Entrantes: `heartbeat`, `join_room`, `chat_message`
- Salientes: `user_online`, `user_offline`

## Infraestructura (opcional)

`docker-compose.yml` provee servicios locales:

- PostgreSQL (`5432`)
- RabbitMQ (`5672`, `15672`)
- Redis (`6379`)
- MinIO (`9000`, `9001`)
- Adminer (`8080`)

Ver `INFRASTRUCTURE.md` para detalles de servicios y setup inicial del bucket de MinIO.

## Limitaciones actuales

- No hay una suite automatizada de tests configurada.
- Algunas integraciones de infraestructura (RabbitMQ/Redis/media) estan parcialmente preparadas o comentadas.

## Solucion de problemas

- Si el frontend no alcanza al backend, verificar que `APP_PORT` y el target del proxy del frontend coincidan.
- Si falla la autenticacion, revisar consistencia de `JWT_SECRET` y configuracion de cookies.
- Si fallan queries a DB, validar credenciales de PostgreSQL y conectividad de red.
