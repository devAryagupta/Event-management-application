const express = require('express');
const env = require('./src/config/env');
const {
  pool,
  registerUserUseCase,
  loginUserUseCase,
  updateTimezoneUseCase,
  listUsersUseCase,
  jwtService,
  createEventUseCase,
  listEventsUseCase,
  getEventUseCase,
  updateEventUseCase,
  deleteEventUseCase,
  addAttendeeUseCase,
  removeAttendeeUseCase,
  getAuditLogsUseCase,
  userRepository,
} = require('./src/container');
const createUserRoutes = require('./src/api/routes/user.routes');
const createEventRoutes = require('./src/api/routes/event.routes');
const requestLogger = require('./src/api/middlewares/requestLogger');
const logger = require('./src/shared/logger');

const app = express();
const MAX_PORT_RETRIES = 5;
const SHUTDOWN_TIMEOUT_MS = 10000;
let httpServer;
let isShuttingDown = false;

app.use(express.json());
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(
  '/api',
  createUserRoutes({
    registerUserUseCase,
    loginUserUseCase,
    updateTimezoneUseCase,
    listUsersUseCase,
    jwtService,
  })
);

app.use(
  '/api',
  createEventRoutes({
    jwtService,
    createEventUseCase,
    listEventsUseCase,
    getEventUseCase,
    updateEventUseCase,
    deleteEventUseCase,
    addAttendeeUseCase,
    removeAttendeeUseCase,
    getAuditLogsUseCase,
    userRepository,
  })
);

function listenWithPortFallback(startPort, retries = MAX_PORT_RETRIES) {
  return new Promise((resolve, reject) => {
    let attempt = 0;

    const tryListen = (port) => {
      const server = app.listen(port, () => {
        if (port !== startPort) {
          logger.warn(`Primary port ${startPort} is busy, backend started on ${port}`);
        }
        resolve({ server, port });
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE' && attempt < retries) {
          attempt += 1;
          const nextPort = startPort + attempt;
          logger.warn(`Port ${port} is in use. Retrying on ${nextPort}...`);
          tryListen(nextPort);
          return;
        }
        reject(err);
      });
    };

    tryListen(startPort);
  });
}

async function shutdown(signal, exitCode = 0) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  logger.info(`${signal} received. Shutting down gracefully...`);

  const forceExitTimer = setTimeout(() => {
    logger.error('Graceful shutdown timed out. Forcing exit.');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  // Do not keep the process alive just because of timeout handle.
  forceExitTimer.unref();

  try {
    if (httpServer) {
      await new Promise((resolve, reject) => {
        httpServer.close((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
      logger.info('HTTP server closed.');
    }

    await pool.end();
    logger.info('Database pool closed.');
    clearTimeout(forceExitTimer);
    process.exit(exitCode);
  } catch (err) {
    clearTimeout(forceExitTimer);
    logger.error('Error during graceful shutdown', err);
    process.exit(1);
  }
}

async function start() {
  try {
    await pool.query('SELECT 1');
    logger.info(`Database connected to ${env.db.host}:${env.db.port}/${env.db.name}`);
    const { server, port } = await listenWithPortFallback(env.port);
    httpServer = server;
    logger.info(`app listening on port ${port}`);
  } catch (err) {
    logger.error('Failed to start the application', err);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});

process.once('SIGUSR2', () => {
  shutdown('SIGUSR2').finally(() => {
    try {
      process.kill(process.pid, 'SIGUSR2');
    } catch (err) {
      process.exit(0);
    }
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', err);
  shutdown('uncaughtException', 1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', reason);
  shutdown('unhandledRejection', 1);
});

start();
