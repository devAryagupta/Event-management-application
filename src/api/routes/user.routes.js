const express = require('express');
const createUserController = require('../controllers/user.controller');

function createUserRoutes({ registerUserUseCase, loginUserUseCase }) {
  const router = express.Router();
  const userController = createUserController({ registerUserUseCase, loginUserUseCase });   
  router.post('/auth/register',(req, res) => userController.register(req, res));
  router.post('/auth/login',(req, res) => userController.login(req, res));
  return router;
}

module.exports = createUserRoutes;