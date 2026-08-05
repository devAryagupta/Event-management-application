const { toCreateEventDto } = require('../dto/createEvent.dto');
const { toUpdateEventDto } = require('../dto/updateEvent.dto');
const { toAddAttendeeDto } = require('../dto/addAttendee.dto');
const { toRemoveAttendeeDto } = require('../dto/removeAttendee.dto');

function createEventController({
  createEventUseCase,
  updateEventUseCase,
  addAttendeeUseCase,
  removeAttendeeUseCase,
  listEventsUseCase,
  getEventUseCase,
  deleteEventUseCase,
}) {
  return {
    async create(req, res) {
      try {
        const input = toCreateEventDto(req.body);
        const event = await createEventUseCase.execute({
          ...input,
          organizerId: req.user.id,
          actorTimezone: req.body.timezone || 'UTC',
        });
        return res.status(201).json({ event });
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
    },
    async list(req, res) {
      try {
        const events = await listEventsUseCase.execute(req.user.id, req.user.isAdmin === true);
        return res.status(200).json({ events });
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
    },
    async getbyid(req, res) {
      try {
        const data = await getEventUseCase.execute(req.params.id, req.user.id, req.user.isAdmin === true);
        return res.status(200).json(data);
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
    },
    async update(req, res) {
      try {
        const patch = toUpdateEventDto(req.body);
        const event = await updateEventUseCase.execute({
          eventId: req.params.id,
          actorId: req.user.id,
          actorTimezone: patch.timezone || 'UTC',
          patch,
        });
        return res.status(200).json({ event });
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
    },

    async addAttendee(req, res) {
      try {
        const input = toAddAttendeeDto(req.body);
        const attendee = await addAttendeeUseCase.execute({
          ...input,
          eventId: req.params.id,
          actorId: req.user.id,
          actorTimezone: req.body.timezone || 'UTC',
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
        const event = await deleteEventUseCase.execute({
          eventId: req.params.id,
          actorId: req.user.id,
          actorTimezone: req.body.timezone || 'UTC',
        });
        return res.status(200).json({ event });
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
    },
    async removeAttendeeFromEvent(req, res) {
      try {
        const input = toRemoveAttendeeDto(req.body);
        const attendee = await removeAttendeeUseCase.execute({
          ...input,
          eventId: req.params.id,
          actorId: req.user.id,
          actorTimezone: req.body.timezone || 'UTC',
        });
        return res.status(200).json({ attendee });
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
    },
  };
}
module.exports = createEventController;
