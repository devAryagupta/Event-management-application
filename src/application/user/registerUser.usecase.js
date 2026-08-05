const bcrypt = require('bcrypt');

class RegisterUserUseCase {
  /**
   * @param {import('../ports/user.repository.port')} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ name, email, password, timezone = 'UTC' }) {
    if (!name || !email || !password) {
      const err = new Error('name, email and password are required');
      err.statusCode = 400;
      throw err;
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      const err = new Error('Email already registered');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      name,
      email,
      passwordHash,
      isAdmin: false,
      timezone,
    });

    // never return password hash to API callers
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      timezone: user.timezone,
      createdAt: user.createdAt,
    };
  }
}

module.exports = RegisterUserUseCase;