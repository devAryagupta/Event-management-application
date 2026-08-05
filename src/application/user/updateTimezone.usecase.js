const { isValidTimezone } = require('../../shared/timezone');

class UpdateTimezoneUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ userId, timezone }) {
    if (!timezone) {
      const err = new Error('timezone is required');
      err.statusCode = 400;
      throw err;
    }
    if (!isValidTimezone(timezone)) {
      const err = new Error('Invalid timezone');
      err.statusCode = 400;
      throw err;
    }

    const updated = await this.userRepository.updateTimezone(userId, timezone);
    if (!updated) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    // Only profile timezone changes. Event UTC rows stay untouched.
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      timezone: updated.timezone,
    };
  }
}

module.exports = UpdateTimezoneUseCase;
