const bcrypt = require('bcrypt');

class LoginUserUseCase {
  /**
   * @param {import('../ports/user.repository.port')} userRepository
   * @param {{ sign: Function }} tokenService
   */
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  async execute({ email, password }) {
    if (!email || !password) {
      const err = new Error('email and password are required');
      err.statusCode = 400;
      throw err;
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const token = this.tokenService.sign({
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        timezone: user.timezone,
      },
    };
  }
}

module.exports = LoginUserUseCase;