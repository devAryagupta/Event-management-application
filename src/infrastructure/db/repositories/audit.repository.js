const AuditRepositoryPort = require('../../../application/ports/audit.repository.port');
const BaseRepository = require('./base.repository');
const Audit = require('../../../domain/entities/Audit');
class AuditRepository extends AuditRepositoryPort {
    constructor(pool) {
        super();
        this.baseRepository = new BaseRepository(pool);
    }
    toEntity(row) {
        return new Audit({
            id: row.id,
            eventId: row.event_id,
            changedBy: row.changed_by,
            changedType: row.changed_type,
            previousValue: row.previous_value,
            newValue: row.new_value,
            actorTimezone: row.actor_timezone,
            createdAt: row.created_at,
        });
    }
    async create(audit) {
        const result = await this.baseRepository.query('INSERT INTO audits (event_id, changed_by,changed_type, previous_value, new_value, created_at, actor_timezone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [audit.eventId, audit.changedBy, audit.changedType, audit.previousValue, audit.newValue, audit.createdAt, audit.actorTimezone]);
        return this.baseRepository.mapone(result, this.toEntity);
    }
    async findById(id) {
        const result = await this.baseRepository.query('SELECT * FROM audits WHERE id = $1', [id]);
        return this.baseRepository.mapone(result, this.toEntity);
    }
    async findByEventId(eventId) {
        const result = await this.baseRepository.query('SELECT * FROM audits WHERE event_id = $1', [eventId]);
        return this.baseRepository.mapmany(result, this.toEntity);
    }
    async findByChangedBy(changedBy) {
        const result = await this.baseRepository.query('SELECT * FROM audits WHERE changed_by = $1', [changedBy]);
        return this.baseRepository.mapmany(result, this.toEntity);
    }
}
module.exports = AuditRepository;