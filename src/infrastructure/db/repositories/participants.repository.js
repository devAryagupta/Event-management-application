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
    });
  }

  resolveDuringBounds(participants) {
    const start =
      participants.duringStart ??
      participants.during?.start ??
      participants.during?.lower;
    const end =
      participants.duringEnd ??
      participants.during?.end ??
      participants.during?.upper;

    if (!start || !end) {
      throw new Error(
        'Participants.during requires duringStart/duringEnd (or during.start/during.end)'
      );
    }

    return { start, end };
  }

  async create(participants) {
    const { start, end } = this.resolveDuringBounds(participants);
    const result = await this.baseRepository.query(
      `INSERT INTO participants (event_id, user_id, role, during)
       VALUES ($1, $2, $3, tstzrange($4::timestamptz, $5::timestamptz, '[)'))
       RETURNING *`,
      [
        participants.eventId,
        participants.userId,
        participants.role ?? 'attendee',
        start,
        end,
      ]
    );
    return this.baseRepository.mapone(result, this.toEntity);
  }

  async findById(id) {
    const result = await this.baseRepository.query(
      'SELECT * FROM participants WHERE id = $1',
      [id]
    );
    return this.baseRepository.mapone(result, this.toEntity);
  }

  async findByEventId(eventId) {
    const result = await this.baseRepository.query(
      'SELECT * FROM participants WHERE event_id = $1',
      [eventId]
    );
    return this.baseRepository.mapmany(result, this.toEntity);
  }

  async findByUserId(userId) {
    const result = await this.baseRepository.query(
      'SELECT * FROM participants WHERE user_id = $1',
      [userId]
    );
    return this.baseRepository.mapmany(result, this.toEntity);
  }

  async update(id, participants) {
    const { start, end } = this.resolveDuringBounds(participants);
    const result = await this.baseRepository.query(
      `UPDATE participants
       SET event_id = $1,
           user_id = $2,
           role = $3,
           during = tstzrange($4::timestamptz, $5::timestamptz, '[)')
       WHERE id = $6
       RETURNING *`,
      [
        participants.eventId,
        participants.userId,
        participants.role ?? 'attendee',
        start,
        end,
        id,
      ]
    );
    if (result.rowCount === 0) {
      return null;
    }
    return this.baseRepository.mapone(result, this.toEntity);
  }

  async delete(id) {
    const result = await this.baseRepository.query(
      'DELETE FROM participants WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rowCount === 0) {
      return null;
    }
    return this.baseRepository.mapone(result, this.toEntity);
  }
  //delete by event and user id to delete all participants of an event
  async deleteByEventAndUser(eventId, userId) {
    const result = await this.baseRepository.query(
      'DELETE FROM participants WHERE event_id = $1 AND user_id = $2 RETURNING *',
      [eventId, userId]
    );
    if (result.rowCount === 0) {
      return null;
    }
    return this.baseRepository.mapone(result, this.toEntity);
  }
  async updateDuringByEventId(eventId, startTime, endTime) {
    const result = await this.baseRepository.query(
      `UPDATE participants
       SET during = tstzrange($1::timestamptz, $2::timestamptz, '[)')
       WHERE event_id = $3
       RETURNING *`,
      [startTime, endTime, eventId]
    );
    if (result.rowCount === 0) {
      return null;
    }
    return this.baseRepository.mapmany(result, this.toEntity);
  }
}

module.exports = ParticipantsRepository;
