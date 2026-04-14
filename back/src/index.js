import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authRouter from "./modules/auth/auth.router.js";
import usersRouter from "./modules/users/users.router.js";
import chatRouter from "./modules/chat/chat.router.js"
import mediaRouter from './modules/media/router.js'
// import { vaultRouter } from "./modules/vault/router.vault.js";

import { startIoServer } from "./modules/socketio/io.router.js"
import { testConnection } from "./core/database/db.conn.js";
// import rabbitmq from "./components/rabbitmq/rabbit.client.js";

testConnection()
const PORT = process.env.APP_PORT;
const CLIENT_URL = process.env.CLIENT_URL;

// process.on('uncaughtException', (err) => {
//   logger.error('Excepción no capturada:', err);
//   process.exit(1);
// });

// process.on('unhandledRejection', (reason, promise) => {
//   logger.error('Promesa no manejada:', reason);
//   process.exit(1);
// });

// Configuración de HTTPS
// const privateKey = fs.readFileSync(path.resolve('utils/privkey.pem'), 'utf8');
// const certificate = fs.readFileSync(path.resolve('utils/cert.pem'), 'utf8');
// const credentials = { key: privateKey, cert: certificate };

// const server = https.createServer(credentials, app);
// server.listen(PORT, () => {
//   console.log(
//     colors.bold.green(`1/2 `),
//     `GrigoriAPI en https://localhost:${PORT}`
//   );
// });


const app = express();
app.use(express.json())
app.use(cookieParser())
app.disable("x-powered-by");

/*                                                    MIDDLEWARE                                    */
app.use(cors({
  origin: ["http://localhost:5173", CLIENT_URL],
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  credentials: true
}))

/*                                                      RUTAS                                          */
app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/chat', chatRouter)
app.use('/media', mediaRouter)
// app.use('api/vault', vaultRouter)

app.get("/", (req, res) => {
  res.status(404).json({ Error: "Ruta no encontrada" });
});

const server = http.createServer(app);
startIoServer(server);

// rabbitmq.connect()

server.listen(PORT, () => {
  console.log(
    // colors.bold.green(`4/6 `),
    `Api en http://localhost:${PORT}`
  );
});

// const gracefulShutdown = async (signal) => {
//   console.log(`\n[SYSTEM] Received ${signal}. Starting graceful shutdown...`);

//   try {
//     // 2. Stop accepting new HTTP/Socket connections first
//     server.close(() => {
//       console.log('[SYSTEM] HTTP server closed.');
//     });

//     // 3. Close the RabbitMQ pipeline cleanly
//     await rabbitClient.close();

//     // Add any database disconnection logic here (e.g., pool.end())

//     console.log('[SYSTEM] Shutdown complete. Exiting process safely.');
//     process.exit(0); // Exit with a success code
//   } catch (err) {
//     console.error('[SYSTEM] Error during shutdown:', err.message);
//     process.exit(1); // Exit with a failure code
//   }
// };

// Listen for terminal interrupt
// process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// // Listen for Docker/OS termination
// process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
