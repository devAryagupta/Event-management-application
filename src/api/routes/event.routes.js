const express = require('express');
const createEventController = require('../controllers/event.controller');
const createAuthenticateMiddleware = require('../middlewares/authentication');

function createEventRoutes({
  createEventUseCase,
  jwtService,
  updateEventUseCase,
  addAttendeeUseCase,
  removeAttendeeUseCase,
  listEventsUseCase,
  getEventUseCase,
  deleteEventUseCase,
  getAuditLogsUseCase,
  userRepository,
}) {
  const router = express.Router();
  const authenticate = createAuthenticateMiddleware({ jwtService });
  const controller = createEventController({
    createEventUseCase,
    updateEventUseCase,
    addAttendeeUseCase,
    removeAttendeeUseCase,
    listEventsUseCase,
    getEventUseCase,
    deleteEventUseCase,
    getAuditLogsUseCase,
    userRepository,
  });

  router.post('/events', authenticate, (req, res) => controller.create(req, res));
  router.put('/events/:id', authenticate, (req, res) => controller.update(req, res));
  router.post('/events/:id/attendees', authenticate, (req, res) =>
    controller.addAttendee(req, res)
  );
  router.delete('/events/:id/attendees', authenticate, (req, res) =>
    controller.removeAttendeeFromEvent(req, res)
  );
  router.get('/events', authenticate, (req, res) => controller.list(req, res));
  router.get('/events/:id', authenticate, (req, res) => controller.getbyid(req, res));
  router.delete('/events/:id', authenticate, (req, res) => controller.removeEvent(req, res));
  router.get('/events/:id/audit', authenticate, (req, res) =>
    controller.getAuditLogs(req, res)
  );

  return router;
}

module.exports = createEventRoutes;
