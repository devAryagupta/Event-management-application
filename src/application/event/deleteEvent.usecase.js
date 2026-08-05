
class DeleteEventUseCase {
    constructor(eventRepository, auditRepository) {
      this.eventRepository = eventRepository;
      this.auditRepository = auditRepository;
    }
    async execute({ eventId, actorId, actorTimezone = 'UTC' }) {
      const existing = await this.eventRepository.findById(eventId);
      if (!existing) {
        const err = new Error('Event not found');
        err.statusCode = 404;
        throw err;
      }
      if (existing.organizerId !== actorId) {
        const err = new Error('Only organizer can cancel/delete this event');
        err.statusCode = 403;
        throw err;
      }
      // Optional audit before delete (audit_logs has ON DELETE CASCADE on event_id,
      // so log AFTER delete would fail — log before, or skip if cascade removes logs)
      await this.auditRepository.create({
        eventId,
        changedBy: actorId,
        changedType: 'DELETE',
        previousValue: existing,
        newValue: { cancelled: true },
        actorTimezone,
      });
      // DELETE event → CASCADE deletes participants → EXCLUDE ranges freed
      const deleted = await this.eventRepository.delete(eventId);
      return deleted;
    }
  }
  module.exports = DeleteEventUseCase;