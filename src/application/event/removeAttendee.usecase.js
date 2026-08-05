class RemoveAttendeeUseCase {
    constructor(eventRepository, participantsRepository, auditRepository) {
      this.eventRepository = eventRepository;
      this.participantsRepository = participantsRepository;
      this.auditRepository = auditRepository;
    }
    async execute({ eventId, userId, actorId, actorTimezone = 'UTC' }) {
      const event = await this.eventRepository.findById(eventId);
      if (!event) {
        const err = new Error('Event not found');
        err.statusCode = 404;
        throw err;
      }
      if (event.organizerId !== actorId && actorId !== userId) {
        const err = new Error('Not allowed to remove this attendee');
        err.statusCode = 403;
        throw err;
      }
      const removed = await this.participantsRepository.deleteByEventAndUser(
        eventId,
        userId
      );
      if (!removed) {
        const err = new Error('Participant not found');
        err.statusCode = 404;
        throw err;
      }
      // deleting participant row frees that user's during range immediately
      await this.auditRepository.create({
        eventId,
        changedBy: actorId,
        changedType: 'ATTENDEE_REMOVED',
        previousValue: { userId },
        newValue: { removed: true },
        actorTimezone,
      });
      return removed;
    }
  }
  module.exports = RemoveAttendeeUseCase;