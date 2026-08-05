class GetAuditLogsUseCase {
  constructor(auditRepository, eventRepository, participantsRepository) {
    this.auditRepository = auditRepository;
    this.eventRepository = eventRepository;
    this.participantsRepository = participantsRepository;
  }

  async execute(eventId, actorId, isAdmin) {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      const err = new Error('Event not found');
      err.statusCode = 404;
      throw err;
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

    return this.auditRepository.findByEventId(eventId);
  }
}

module.exports = GetAuditLogsUseCase;
