const { toRegisterUserDto } = require('../dto/registerUser.dto');
const { toLoginUserDto } = require('../dto/loginuser.dto');
function createUserController({ registerUserUseCase, loginUserUseCase }) {
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
    async login(req, res) {
      try {
        const input = toLoginUserDto(req.body);
        const result = await loginUserUseCase.execute(input);
        return res.status(200).json(result);
      } catch (err) {
        const status = err.statusCode || 500;
        return res.status(status).json({ error: err.message });
      }
    },
  };
}

module.exports = createUserController;