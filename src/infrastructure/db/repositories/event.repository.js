const EventRepositoryPort = require('../../../application/ports/event.repository.port');
const BaseRepository = require('./base.repository');
const Event = require('../../../domain/entities/Event');
class EventRepository extends EventRepositoryPort {
    constructor(pool) {
        super();
        this.baseRepository = new BaseRepository(pool);
    }
    toEntity(row) {
        return new Event({
            id: row.id,
            title: row.title,
            description: row.description,
            location: row.location,
            startTime: row.start_time,
            endTime: row.end_time,
            timezone: row.timezone,
            organizerId: row.organizer_id,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }); 
    }
    async create(event) {
        const result = await this.baseRepository.query(
            `INSERT INTO events (title, description, location, start_time, end_time, timezone, organizer_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                event.title,
                event.description,
                event.location,
                event.startTime,
                event.endTime,
                event.timezone,
                event.organizerId,
            ]
        );
        return this.baseRepository.mapone(result, this.toEntity);
    }
    async findById(id) {
        const result = await this.baseRepository.query('SELECT * FROM events WHERE id = $1', [id]);
        return this.baseRepository.mapone(result, this.toEntity);
    }
    async findByOrganizerId(organizerId) {
        const result = await this.baseRepository.query('SELECT * FROM events WHERE organizer_id = $1', [organizerId]);
        return this.baseRepository.mapmany(result, this.toEntity);
    }
    async findByTitle(title) {
        const result = await this.baseRepository.query('SELECT * FROM events WHERE title = $1', [title]);
        return this.baseRepository.mapmany(result, this.toEntity);
    }
    async update(id, event) {
        const result = await this.baseRepository.query(
            `UPDATE events
             SET title = $1,
                 description = $2,
                 location = $3,
                 start_time = $4,
                 end_time = $5,
                 timezone = $6,
                 organizer_id = $7,
                 updated_at = NOW()
             WHERE id = $8
             RETURNING *`,
            [
                event.title,
                event.description,
                event.location,
                event.startTime,
                event.endTime,
                event.timezone,
                event.organizerId,
                id,
            ]
        );
        if (result.rowCount === 0) {
            return null;
        }
        return this.baseRepository.mapone(result, this.toEntity);
    }
    async delete(id) {
        const result = await this.baseRepository.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
        if(result.rowCount === 0) {
            return null;
        }
        return this.baseRepository.mapone(result, this.toEntity);
    }
    async list() {
        const result = await this.baseRepository.query('SELECT * FROM events');
        return this.baseRepository.mapmany(result, this.toEntity);
    }
}
module.exports = EventRepository;