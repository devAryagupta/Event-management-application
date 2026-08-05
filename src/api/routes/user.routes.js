const express = require('express');
const createUserController = require('../controllers/user.controller');
const createAuthenticateMiddleware = require('../middlewares/authentication');

function createUserRoutes({
  registerUserUseCase,
  loginUserUseCase,
  updateTimezoneUseCase,
  jwtService,
}) {
  const router = express.Router();
  const authenticate = createAuthenticateMiddleware({ jwtService });
  const userController = createUserController({
    registerUserUseCase,
    loginUserUseCase,
    updateTimezoneUseCase,
  });

  router.post('/auth/register', (req, res) => userController.register(req, res));
  router.post('/auth/login', (req, res) => userController.login(req, res));
  router.patch('/me/timezone', authenticate, (req, res) =>
    userController.updateTimezone(req, res)
  );

  return router;
}

module.exports = createUserRoutes;