class UpdateEventUseCase {
    constructor(eventRepository, participantsRepository, auditRepository) {
      this.eventRepository = eventRepository;
      this.participantsRepository = participantsRepository;
      this.auditRepository = auditRepository;
    }
    async execute({ eventId, actorId, actorTimezone = 'UTC', patch }) {
      const existing = await this.eventRepository.findById(eventId);
      if (!existing) {
        const err = new Error('Event not found');
        err.statusCode = 404;
        throw err;
      }
      if (existing.organizerId !== actorId) {
        const err = new Error(
          'Only the organizer can edit this meeting.'
        );
        err.statusCode = 403;
        throw err;
      }
      const next = {
        title: patch.title ?? existing.title,
        description: patch.description ?? existing.description,
        location: patch.location ?? existing.location,
        timezone: patch.timezone ?? existing.timezone,
        startTime: patch.startTime ?? existing.startTime,
        endTime: patch.endTime ?? existing.endTime,
        organizerId: existing.organizerId,
      };
      if (new Date(next.endTime) <= new Date(next.startTime)) {
        const err = new Error('endTime must be after startTime');
        err.statusCode = 400;
        throw err;
      }
      const updated = await this.eventRepository.update(eventId, next);
      // keep everyone's busy-slot in sync when time changes
      const timeChanged =
        String(existing.startTime) !== String(next.startTime) ||
        String(existing.endTime) !== String(next.endTime);
      if (timeChanged) {
        try {
          await this.participantsRepository.updateDuringByEventId(
            eventId,
            next.startTime,
            next.endTime
          );
        } catch (e) {
          const err = new Error(
            'The new time conflicts with another meeting for one or more participants. Please choose a different slot.'
          );
          err.statusCode = 409;
          err.code = 'CONFLICT';
          err.status = 'Not Available';
          throw err;
        }
      }
      const toSnapshot = (event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        timezone: event.timezone,
        startTime: event.startTime,
        endTime: event.endTime,
        organizerId: event.organizerId,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      });

      await this.auditRepository.create({
        eventId,
        changedBy: actorId,
        changedType: 'UPDATE',
        previousValue: toSnapshot(existing),
        newValue: toSnapshot(updated),
        actorTimezone,
      });
      return updated;
    }
  }
  module.exports = UpdateEventUseCase;