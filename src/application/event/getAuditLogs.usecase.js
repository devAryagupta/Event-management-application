class GetAuditLogsUseCase {
  constructor(auditRepository, eventRepository, participantsRepository) {
    this.auditRepository = auditRepository;
    this.eventRepository = eventRepository;
    this.participantsRepository = participantsRepository;
  }

  async execute(eventId, actorId, isAdmin) {
    const event = await this.eventRepository.findById(eventId);
    const logs = await this.auditRepository.findByEventId(eventId);

    if (!event) {
      if (logs.length === 0) {
        const err = new Error('Event not found');
        err.statusCode = 404;
        throw err;
      }

      // Event was deleted; authorize from surviving log snapshots.
      if (!isAdmin) {
        const allowed = logs.some(
          (log) =>
            log.changedBy === actorId ||
            log.previousValue?.organizerId === actorId ||
            log.newValue?.organizerId === actorId
        );
        if (!allowed) {
          const err = new Error('You are not involved in this event');
          err.statusCode = 403;
          throw err;
        }
      }

      return logs;
    }

    if (!isAdmin) {
      const participants = await this.participantsRepository.findByEventId(eventId);
      const involved = participants.some((participant) => participant.userId === actorId);
      const isOrganizer = event.organizerId === actorId;
      if (!involved && !isOrganizer) {
        const err = new Error('You are not involved in this event');
        err.statusCode = 403;
        throw err;
      }
    }

    return logs;
  }
}

module.exports = GetAuditLogsUseCase;
