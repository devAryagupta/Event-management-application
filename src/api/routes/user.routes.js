const express = require('express');
const createUserController = require('../controllers/user.controller');

function createUserRoutes({ registerUserUseCase }) {
  const router = express.Router();
  router.post('/auth/register',(req, res) => createUserController({ registerUserUseCase }).register(req, res));
  return router;
}

module.exports = createUserRoutes;