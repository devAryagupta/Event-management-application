const { toRegisterUserDto } = require('../dto/registerUser.dto');

function createUserController({ registerUserUseCase }) {
  return {
    async register(req, res) {
      try {
        const input = toRegisterUserDto(req.body);
        const user = await registerUserUseCase.execute(input);
        return res.status(201).json({ user });
      } catch (err) {
        const status = err.statusCode || 500;
        return res.status(status).json({ error: err.message });
      }
    },
  };
}

module.exports = createUserController;