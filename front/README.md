# Cryptex Frontend

Frontend en React 18 para la app Cryptex, construido con Vite y estilizado con TailwindCSS. Incluye vistas de autenticacion, chat, vault y escaner de red.

## Stack Tecnologico

- React 18
- React Router v6
- TailwindCSS
- Cliente Socket.IO
- Vite
- pnpm

## Requisitos Previos

- Node.js 18+
- pnpm 8+
- Backend de Cryptex ejecutandose en el puerto `3000` para flujos de API y autenticacion

## Instalacion

```bash
pnpm install
```

## Configuracion de Entorno

Crea o actualiza `front/.env` con los valores usados por Vite y la app:

```bash
API_URL=http://localhost:3000
APP_PORT=5173
VITE_SOCKET_URL=http://localhost:3000
```

Notas:
- `API_URL` y `APP_PORT` se leen en `vite.config.js`.
- `VITE_SOCKET_URL` se usa en `src/services/socket.js`.

## Ejecutar en Desarrollo

```bash
pnpm run dev
```

Vite se ejecuta con `--host`, por lo que queda disponible en tu red local.

## Build para Produccion

```bash
pnpm run build
```

Vista previa local opcional:

```bash
pnpm run preview
```

## Ruteo y Proxy de API

El frontend usa reglas de proxy de Vite en `vite.config.js` para endpoints del backend. Las solicitudes se redirigen a `API_URL`:

- `/api`
- `/auth/login`
- `/auth/me`
- `/auth/token`
- `/users/getUsers`
- `/chat/getChatHistory`
- `/media/upload`

Asegurate de que el backend sea accesible en el `API_URL` configurado.

## Estructura del Proyecto

```text
front/
  src/
    components/      # Componentes reutilizables de UI y layout
    context/         # Proveedor de estado global de autenticacion
    pages/           # Pantallas por ruta
    services/        # Logica de API y cliente de sockets
    App.jsx          # Router principal y contenedor de la app
    main.jsx         # Punto de entrada de React
```

## Solucion de Problemas

- **Las llamadas a la API fallan o devuelven 404:** verifica que el backend este corriendo en `localhost:3000` (o actualiza `API_URL`).
- **Falla la conexion por socket:** verifica `VITE_SOCKET_URL` y la disponibilidad de Socket.IO en el backend.
- **Paginas en blanco o redireccionadas:** revisa el flujo de rutas en `src/App.jsx` y el estado de autenticacion de `src/context/AuthContext.jsx`.

## Notas

- El proyecto usa solo JavaScript (`.js` / `.jsx`), sin configuracion de TypeScript.
- Actualmente no hay scripts de test/lint configurados en `package.json`.
