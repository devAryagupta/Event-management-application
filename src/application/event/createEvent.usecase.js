
class CreateEventUseCase {
    constructor(eventRepository, participantsRepository, auditRepository) {
      this.eventRepository = eventRepository;
      this.participantsRepository = participantsRepository;
      this.auditRepository = auditRepository;
    }
    async execute({
      title,
      description = null,
      location = null,
      timezone,
      startTime,
      endTime,
      organizerId,
      actorTimezone = 'UTC',
    }) {
      if (!title || !timezone || !startTime || !endTime || !organizerId) {
        const err = new Error('title, timezone, startTime, endTime are required');
        err.statusCode = 400;
        throw err;
      }
      if (new Date(endTime) <= new Date(startTime)) {
        const err = new Error('endTime must be after startTime');
        err.statusCode = 400;
        throw err;
      }
      const event = await this.eventRepository.create({
        title,
        description,
        location,
        timezone,
        startTime,
        endTime,
        organizerId,
      });
      await this.participantsRepository.create({
        eventId: event.id,
        userId: organizerId,
        role: 'organizer',
        duringStart: startTime,
        duringEnd: endTime,
      });
      await this.auditRepository.create({
        eventId: event.id,
        changedBy: organizerId,
        changedType: 'CREATE',
        previousValue: null,
        newValue: {
          id: event.id,
          title: event.title,
          description: event.description,
          location: event.location,
          timezone: event.timezone,
          startTime: event.startTime,
          endTime: event.endTime,
          organizerId: event.organizerId,
        },
        actorTimezone,
      });
      return event;
    }
  }
  module.exports = CreateEventUseCase;