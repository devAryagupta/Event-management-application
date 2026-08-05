const {
  createHttpError,
  conflictError,
  isAvailabilityConflict,
  isUniqueViolation,
} = require('../../shared/httpError');

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
      throw createHttpError('Event not found.', 404);
    }
    if (event.organizerId !== actorId) {
      throw createHttpError('Only the organizer can add attendees.', 403);
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw createHttpError('Selected profile could not be found.', 404);
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
      if (isUniqueViolation(e)) {
        throw conflictError(`${user.name} is already part of this meeting.`, {
          status: 'Already In Event',
        });
      }
      if (isAvailabilityConflict(e)) {
        throw conflictError(
          `${user.name} is not available at this time. Please choose another slot.`,
          { status: 'Not Available', busyUserId: userId, busyUserName: user.name }
        );
      }
      throw conflictError(
        `${user.name} could not be added to this meeting. Please try a different time.`,
        { status: 'Not Available' }
      );
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
