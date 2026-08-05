const pool = require('./infrastructure/db/postgres.client');
const UserRepository = require('./infrastructure/db/repositories/user.repository');
const EventRepository = require('./infrastructure/db/repositories/event.repository');
const ParticipantsRepository = require('./infrastructure/db/repositories/participants.repository');
const AuditRepository = require('./infrastructure/db/repositories/audit.repository');
const JwtService = require('./infrastructure/auth/jwt.service');

const RegisterUserUseCase = require('./application/user/registerUser.usecase');
const LoginUserUseCase = require('./application/user/loginUser.usecase');

const jwtService = new JwtService();
const userRepository = new UserRepository(pool);
const eventRepository = new EventRepository(pool);
const participantsRepository = new ParticipantsRepository(pool);
const auditRepository = new AuditRepository(pool); 
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository, jwtService);

module.exports = { pool, userRepository, eventRepository, participantsRepository, auditRepository, registerUserUseCase, loginUserUseCase, jwtService };