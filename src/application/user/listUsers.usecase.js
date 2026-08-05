class ListUsersUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute() {
    const users = await this.userRepository.list();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      timezone: user.timezone,
    }));
  }
}

module.exports = ListUsersUseCase;