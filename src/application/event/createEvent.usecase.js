class CreateEventUseCase {
  constructor(
    eventRepository,
    participantsRepository,
    auditRepository,
    userRepository
  ) {
    this.eventRepository = eventRepository;
    this.participantsRepository = participantsRepository;
    this.auditRepository = auditRepository;
    this.userRepository = userRepository;
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
    profileIds = [],
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

    const uniqueProfileIds = [
      ...new Set((profileIds || []).filter(Boolean)),
    ].filter((id) => id !== organizerId);

    for (const userId of uniqueProfileIds) {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        const err = new Error(`User not found: ${userId}`);
        err.statusCode = 404;
        throw err;
      }
    }

    let event;
    try {
      event = await this.eventRepository.create({
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

      for (const userId of uniqueProfileIds) {
        try {
          await this.participantsRepository.create({
            eventId: event.id,
            userId,
            role: 'attendee',
            duringStart: startTime,
            duringEnd: endTime,
          });
        } catch (e) {
          const err = new Error(
            e.code === '23505' ? 'User already in event' : 'Not Available'
          );
          err.statusCode = 409;
          if (e.code !== '23505') err.status = 'Not Available';
          throw err;
        }
      }

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
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
          profileIds: uniqueProfileIds,
        },
        actorTimezone,
      });

      return event;
    } catch (err) {
      // Compensate partial create so we don't leave a half-built event.
      if (event?.id) {
        try {
          await this.eventRepository.delete(event.id);
        } catch (_) {
          // best-effort cleanup
        }
      }
      throw err;
    }
  }
}

module.exports = CreateEventUseCase;
