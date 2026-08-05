const ParticipantsRepositoryPort = require('../../../application/ports/participants.repository.port');
const BaseRepository = require('./base.repository');
const Participants = require('../../../domain/entities/Participants');
class ParticipantsRepository extends ParticipantsRepositoryPort {
    constructor(pool) {
        super();
        this.baseRepository = new BaseRepository(pool);
    }
    toEntity(row) {
        return new Participants({
            id: row.id,
            eventId: row.event_id,
            userId: row.user_id,
            role: row.role,
            during: row.during,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }
    async create(participants) {
        const result = await this.baseRepository.query('INSERT INTO participants (event_id, user_id, created_at,role, during, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [participants.eventId, participants.userId, participants.createdAt, participants.role, participants.during, participants.updatedAt?? participants.createdAt]);
        return this.baseRepository.mapone(result, this.toEntity);
    }
    async findById(id) {
        const result = await this.baseRepository.query('SELECT * FROM participants WHERE id = $1', [id]);
        return this.baseRepository.mapone(result, this.toEntity);
    }
    async findByEventId(eventId) {
        const result = await this.baseRepository.query('SELECT * FROM participants WHERE event_id = $1', [eventId]);
        return this.baseRepository.mapmany(result, this.toEntity);
    }
    async findByUserId(userId) {
        const result = await this.baseRepository.query('SELECT * FROM participants WHERE user_id = $1', [userId]);
        return this.baseRepository.mapmany(result, this.toEntity);
    }
    async update(id, participants) {
        const result = await this.baseRepository.query('UPDATE participants SET event_id = $1, user_id = $2, role = $3, during = $4, updated_at = $5 WHERE id = $6 RETURNING *', [participants.eventId, participants.userId, participants.role, participants.during, participants.updatedAt?? participants.createdAt, id]);
        if(result.rowCount === 0) {
            return null;
        }
        return this.baseRepository.mapone(result, this.toEntity);
    }
    async delete(id) {
        const result = await this.baseRepository.query('DELETE FROM participants WHERE id = $1 RETURNING *', [id]);
        if(result.rowCount === 0) {
            return null;
        }
        return this.baseRepository.mapone(result, this.toEntity);
    }
}
module.exports = ParticipantsRepository;