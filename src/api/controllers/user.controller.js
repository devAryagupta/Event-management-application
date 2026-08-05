const { toRegisterUserDto } = require('../dto/registerUser.dto');
const { toLoginUserDto } = require('../dto/loginuser.dto');
const { toUpdateTimezoneDto } = require('../dto/updateTimezone.dto');

function createUserController({
  registerUserUseCase,
  loginUserUseCase,
  updateTimezoneUseCase,
}) {
  return {
    async register(req, res) {
      try {
        const input = toRegisterUserDto(req.body);
        const user = await registerUserUseCase.execute(input);
        return res.status(201).json({ user });
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
    },

    async login(req, res) {
      try {
        const input = toLoginUserDto(req.body);
        const result = await loginUserUseCase.execute(input);
        return res.status(200).json(result);
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
    },

    async updateTimezone(req, res) {
      try {
        const input = toUpdateTimezoneDto(req.body);
        const user = await updateTimezoneUseCase.execute({
          userId: req.user.id,
          timezone: input.timezone,
        });
        return res.status(200).json({ user });
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
    },
  };
}

module.exports = createUserController;
