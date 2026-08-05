const {
  createHttpError,
  conflictError,
  isAvailabilityConflict,
  isUniqueViolation,
} = require('../../shared/httpError');

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
      throw createHttpError(
        'Please provide a title, timezone, start time, and end time.',
        400
      );
    }
    if (new Date(endTime) <= new Date(startTime)) {
      throw createHttpError('End time must be after start time.', 400);
    }

    const uniqueProfileIds = [
      ...new Set((profileIds || []).filter(Boolean)),
    ].filter((id) => id !== organizerId);

    const attendeesById = new Map();
    for (const userId of uniqueProfileIds) {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw createHttpError(
          'One of the selected profiles could not be found. Please refresh and try again.',
          404
        );
      }
      attendeesById.set(userId, user);
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

      try {
        await this.participantsRepository.create({
          eventId: event.id,
          userId: organizerId,
          role: 'organizer',
          duringStart: startTime,
          duringEnd: endTime,
        });
      } catch (e) {
        if (isAvailabilityConflict(e)) {
          throw conflictError(
            'You already have another meeting at this time. Please choose a different slot.',
            { status: 'Not Available' }
          );
        }
        throw e;
      }

      for (const userId of uniqueProfileIds) {
        const attendee = attendeesById.get(userId);
        try {
          await this.participantsRepository.create({
            eventId: event.id,
            userId,
            role: 'attendee',
            duringStart: startTime,
            duringEnd: endTime,
          });
        } catch (e) {
          if (isUniqueViolation(e)) {
            throw conflictError(
              `${attendee.name} is already part of this meeting.`,
              { status: 'Already In Event' }
            );
          }
          if (isAvailabilityConflict(e)) {
            throw conflictError(
              `${attendee.name} is not available at this time. Please choose another slot or remove them from the meeting.`,
              { status: 'Not Available', busyUserId: userId, busyUserName: attendee.name }
            );
          }
          throw conflictError(
            `${attendee.name} could not be added to this meeting. Please try a different time.`,
            { status: 'Not Available' }
          );
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
