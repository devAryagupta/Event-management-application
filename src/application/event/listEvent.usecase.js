class ListEventsUseCase {
    constructor(eventRepository) {
      this.eventRepository = eventRepository;
    }
    async execute() {
      return this.eventRepository.list();
    }
  }
  module.exports = ListEventsUseCase;