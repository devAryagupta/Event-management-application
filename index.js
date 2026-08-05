const express = require('express');
const env = require('./src/config/env');
const {
  pool,
  registerUserUseCase,
  loginUserUseCase,
  updateTimezoneUseCase,
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

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(
  '/api',
  createUserRoutes({
    registerUserUseCase,
    loginUserUseCase,
    updateTimezoneUseCase,
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

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log(`Database connected to ${env.db.host}:${env.db.port}/${env.db.name}`);
    app.listen(env.port, () => {
      console.log(`app listening on port ${env.port}`);
    });
  } catch (err) {
    console.error('Failed to start the application', err);
    process.exit(1);
  }
}

start();
