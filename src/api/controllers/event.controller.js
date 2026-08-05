
const { toCreateEventDto } = require('../dto/createEvent.dto');
function createEventController({ createEventUseCase }) {
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
  };
}
module.exports = createEventController;