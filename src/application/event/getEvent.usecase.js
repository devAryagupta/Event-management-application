class GetEventUseCase {
    constructor(eventRepository, participantsRepository) {
      this.eventRepository = eventRepository;
      this.participantsRepository = participantsRepository;
    }
    async execute(eventId) {
      const event = await this.eventRepository.findById(eventId);
      if (!event) {
        const err = new Error('Event not found');
        err.statusCode = 404;
        throw err;
      }
      const participants = await this.participantsRepository.findByEventId(eventId);
      return { event, participants };
    }
  }
  module.exports = GetEventUseCase;