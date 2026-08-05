class AddAttendeeUseCase {
    constructor(eventRepository, participantsRepository, auditRepository, userRepository) {
      this.eventRepository = eventRepository;
      this.participantsRepository = participantsRepository;
      this.auditRepository = auditRepository;
      this.userRepository = userRepository;
    }
    async execute({ eventId, userId, actorId, actorTimezone = 'UTC', role = 'attendee' }) {
      const event = await this.eventRepository.findById(eventId);
      if (!event) {
        const err = new Error('Event not found');
        err.statusCode = 404;
        throw err;
      }
      if (event.organizerId !== actorId) {
        const err = new Error('Only organizer can add attendees');
        err.statusCode = 403;
        throw err;
      }
      const user = await this.userRepository.findById(userId);
      if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
      }
      let participant;
      try {
        participant = await this.participantsRepository.create({
          eventId,
          userId,
          role,
          duringStart: event.startTime,
          duringEnd: event.endTime,
        });
      } catch (e) {
        // unique or EXCLUDE overlap
        const err = new Error(
          'User already in event or not available in this time range'
        );
        err.statusCode = 409;
        throw err;
      }
      await this.auditRepository.create({
        eventId,
        changedBy: actorId,
        changedType: 'ATTENDEE_ADDED',
        previousValue: null,
        newValue: { userId, role },
        actorTimezone,
      });
      return participant;
    }
  }
  module.exports = AddAttendeeUseCase;