const { toRegisterUserDto } = require('../dto/registerUser.dto');
const { toLoginUserDto } = require('../dto/loginUser.dto');
const { toUpdateTimezoneDto } = require('../dto/updateTimezone.dto');
const { listSupportedTimezones } = require('../../shared/timezone');
const sendApiError = require('../http/sendApiError');

function createUserController({
  registerUserUseCase,
  loginUserUseCase,
  updateTimezoneUseCase,
  listUsersUseCase,
}) {
  return {
    async register(req, res) {
      try {
        const input = toRegisterUserDto(req.body);
        const user = await registerUserUseCase.execute(input);
        return res.status(201).json({ user });
      } catch (err) {
        return sendApiError(req, res, err);
      }
    },

    async login(req, res) {
      try {
        const input = toLoginUserDto(req.body);
        const result = await loginUserUseCase.execute(input);
        return res.status(200).json(result);
      } catch (err) {
        return sendApiError(req, res, err);
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
        return sendApiError(req, res, err);
      }
    },

    async list(req, res) {
      try {
        const users = await listUsersUseCase.execute();
        return res.status(200).json({ users });
      } catch (err) {
        return sendApiError(req, res, err);
      }
    },

    async listTimezones(req, res) {
      try {
        return res.status(200).json({ timezones: listSupportedTimezones() });
      } catch (err) {
        return sendApiError(req, res, err);
      }
    },
  };
}

module.exports = createUserController;
