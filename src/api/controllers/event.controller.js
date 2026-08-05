const { toCreateEventDto } = require('../dto/createEvent.dto');
const { toUpdateEventDto } = require('../dto/updateEvent.dto');
const { toAddAttendeeDto } = require('../dto/addAttendee.dto');
const { toRemoveAttendeeDto } = require('../dto/removeAttendee.dto');
const {
  mapEventForViewer,
  mapEventsForViewer,
  mapLogsForViewer,
} = require('../mappers/eventResponse.mapper');

function createEventController({
  createEventUseCase,
  updateEventUseCase,
  addAttendeeUseCase,
  removeAttendeeUseCase,
  listEventsUseCase,
  getEventUseCase,
  deleteEventUseCase,
  getAuditLogsUseCase,
  userRepository,
}) {
  async function getActorTimezone(userId) {
    const user = await userRepository.findById(userId);
    return user?.timezone || 'UTC';
  }

  return {
    async create(req, res) {
      try {
        const input = toCreateEventDto(req.body);
        const actorTimezone = await getActorTimezone(req.user.id);
        const event = await createEventUseCase.execute({
          ...input,
          organizerId: req.user.id,
          actorTimezone,
        });
        return res.status(201).json({
          event: mapEventForViewer(event, actorTimezone),
        });
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
    },

    async list(req, res) {
      try {
        const events = await listEventsUseCase.execute(
          req.user.id,
          req.user.isAdmin === true
        );
        const viewerTimezone = await getActorTimezone(req.user.id);
        return res.status(200).json({
          events: mapEventsForViewer(events, viewerTimezone),
        });
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
    },

    async getbyid(req, res) {
      try {
        const data = await getEventUseCase.execute(
          req.params.id,
          req.user.id,
          req.user.isAdmin === true
        );
        const viewerTimezone = await getActorTimezone(req.user.id);
        return res.status(200).json({
          event: mapEventForViewer(data.event, viewerTimezone),
          participants: data.participants,
        });
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
    },

    async update(req, res) {
      try {
        const patch = toUpdateEventDto(req.body);
        const actorTimezone = await getActorTimezone(req.user.id);
        const event = await updateEventUseCase.execute({
          eventId: req.params.id,
          actorId: req.user.id,
          actorTimezone,
          patch,
        });
        return res.status(200).json({
          event: mapEventForViewer(event, actorTimezone),
        });
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
    },

    async addAttendee(req, res) {
      try {
        const input = toAddAttendeeDto(req.body);
        const actorTimezone = await getActorTimezone(req.user.id);
        const attendee = await addAttendeeUseCase.execute({
          ...input,
          eventId: req.params.id,
          actorId: req.user.id,
          actorTimezone,
        });
        return res.status(200).json({ attendee });
      } catch (err) {
        return res.status(err.statusCode || 500).json({
          error: err.message,
          ...(err.status ? { status: err.status } : {}),
        });
      }
    },

    async removeEvent(req, res) {
      try {
        const actorTimezone = await getActorTimezone(req.user.id);
        const event = await deleteEventUseCase.execute({
          eventId: req.params.id,
          actorId: req.user.id,
          actorTimezone,
        });
        return res.status(200).json({
          event: mapEventForViewer(event, actorTimezone),
        });
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
    },

    async removeAttendeeFromEvent(req, res) {
      try {
        const input = toRemoveAttendeeDto(req.body);
        const actorTimezone = await getActorTimezone(req.user.id);
        const attendee = await removeAttendeeUseCase.execute({
          ...input,
          eventId: req.params.id,
          actorId: req.user.id,
          actorTimezone,
        });
        return res.status(200).json({ attendee });
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
    },

    async getAuditLogs(req, res) {
      try {
        const logs = await getAuditLogsUseCase.execute(
          req.params.id,
          req.user.id,
          req.user.isAdmin === true
        );
        const viewerTimezone = await getActorTimezone(req.user.id);
        return res.status(200).json({
          logs: mapLogsForViewer(logs, viewerTimezone),
        });
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
    },
  };
}

module.exports = createEventController;
