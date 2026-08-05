const pool = require('./infrastructure/db/postgres.client');
const UserRepository = require('./infrastructure/db/repositories/user.repository');
const EventRepository = require('./infrastructure/db/repositories/event.repository');
const ParticipantsRepository = require('./infrastructure/db/repositories/participants.repository');
const AuditRepository = require('./infrastructure/db/repositories/audit.repository');
const JwtService = require('./infrastructure/auth/jwt.service');

const CreateEventUseCase = require('./application/event/createEvent.usecase');
const ListEventsUseCase = require('./application/event/listEvent.usecase');
const GetEventUseCase = require('./application/event/getEvent.usecase');
const DeleteEventUseCase = require('./application/event/deleteEvent.usecase');
const UpdateEventUseCase = require('./application/event/updateEvent.usecase');
const AddAttendeeUseCase = require('./application/event/addAttendee.usecase');
const RemoveAttendeeUseCase = require('./application/event/removeAttendee.usecase');
const GetAuditLogsUseCase = require('./application/event/getAuditLogs.usecase');
const RegisterUserUseCase = require('./application/user/registerUser.usecase');
const LoginUserUseCase = require('./application/user/loginUser.usecase');
const UpdateTimezoneUseCase = require('./application/user/updateTimezone.usecase');
const ListUsersUseCase = require('./application/user/listUsers.usecase');

const jwtService = new JwtService();
const userRepository = new UserRepository(pool);
const eventRepository = new EventRepository(pool);
const participantsRepository = new ParticipantsRepository(pool);
const auditRepository = new AuditRepository(pool);

const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository, jwtService);
const updateTimezoneUseCase = new UpdateTimezoneUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const createEventUseCase = new CreateEventUseCase(
  eventRepository,
  participantsRepository,
  auditRepository,
  userRepository
);
const listEventsUseCase = new ListEventsUseCase(eventRepository);
const getEventUseCase = new GetEventUseCase(eventRepository, participantsRepository);
const deleteEventUseCase = new DeleteEventUseCase(eventRepository, auditRepository);
const updateEventUseCase = new UpdateEventUseCase(
  eventRepository,
  participantsRepository,
  auditRepository
);
const addAttendeeUseCase = new AddAttendeeUseCase(
  eventRepository,
  participantsRepository,
  auditRepository,
  userRepository
);
const removeAttendeeUseCase = new RemoveAttendeeUseCase(
  eventRepository,
  participantsRepository,
  auditRepository
);
const getAuditLogsUseCase = new GetAuditLogsUseCase(
  auditRepository,
  eventRepository,
  participantsRepository
);

module.exports = {
  pool,
  userRepository,
  eventRepository,
  participantsRepository,
  auditRepository,
  registerUserUseCase,
  loginUserUseCase,
  updateTimezoneUseCase,
  listUsersUseCase,
  jwtService,
  createEventUseCase,
  listEventsUseCase,
  getEventUseCase,
  updateEventUseCase,
  deleteEventUseCase,
  addAttendeeUseCase,
  removeAttendeeUseCase,
  getAuditLogsUseCase,
};
