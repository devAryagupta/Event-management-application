const express = require('express');
const createUserController = require('../controllers/user.controller');
const createAuthenticateMiddleware = require('../middlewares/authentication');

function createUserRoutes({
  registerUserUseCase,
  loginUserUseCase,
  updateTimezoneUseCase,
  listUsersUseCase,
  jwtService,
}) {
  const router = express.Router();
  const authenticate = createAuthenticateMiddleware({ jwtService });
  const userController = createUserController({
    registerUserUseCase,
    loginUserUseCase,
    updateTimezoneUseCase,
    listUsersUseCase,
  });

  router.post('/auth/register', (req, res) => userController.register(req, res));
  router.post('/auth/login', (req, res) => userController.login(req, res));
  router.get('/timezones', (req, res) => userController.listTimezones(req, res));
  router.get('/users', authenticate, (req, res) => userController.list(req, res));
  router.patch('/me/timezone', authenticate, (req, res) =>
    userController.updateTimezone(req, res)
  );

  return router;
}

module.exports = createUserRoutes;