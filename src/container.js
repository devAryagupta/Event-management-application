const pool = require('./infrastructure/db/postgres.client');
const UserRepository = require('./infrastructure/db/repositories/user.repository');
const EventRepository = require('./infrastructure/db/repositories/event.repository');
const ParticipantsRepository = require('./infrastructure/db/repositories/participants.repository');
const AuditRepository = require('./infrastructure/db/repositories/audit.repository');

const userRepository = new UserRepository(pool);
const eventRepository = new EventRepository(pool);
const participantsRepository = new ParticipantsRepository(pool);
const auditRepository = new AuditRepository(pool); 

module.exports = { pool, userRepository, eventRepository, participantsRepository, auditRepository };