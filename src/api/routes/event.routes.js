const express = require('express');
const createEventController = require('../controllers/event.controller');
const createAuthenticateMiddleware = require('../middlewares/authentication');
function createEventRoutes({ createEventUseCase, jwtService }) {
  const router = express.Router();
  const authenticate = createAuthenticateMiddleware({ jwtService });
  const controller = createEventController({ createEventUseCase });
  router.post('/events', authenticate, (req, res) => controller.create(req, res));
  return router;
}
module.exports = createEventRoutes;