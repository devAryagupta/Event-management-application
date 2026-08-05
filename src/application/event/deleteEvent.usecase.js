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

    const snapshot = {
      id: existing.id,
      title: existing.title,
      description: existing.description,
      location: existing.location,
      timezone: existing.timezone,
      startTime: existing.startTime,
      endTime: existing.endTime,
      organizerId: existing.organizerId,
      createdAt: existing.createdAt,
      updatedAt: existing.updatedAt,
    };

    // audit_logs.event_id uses ON DELETE SET NULL, so this row survives
    // after the event is removed. Snapshot keeps the original event id.
    await this.auditRepository.create({
      eventId,
      changedBy: actorId,
      changedType: 'DELETE',
      previousValue: snapshot,
      newValue: {
        id: existing.id,
        cancelled: true,
      },
      actorTimezone,
    });

    const deleted = await this.eventRepository.delete(eventId);
    return deleted;
  }
}

module.exports = DeleteEventUseCase;
