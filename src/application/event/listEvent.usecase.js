class ListEventsUseCase {
    constructor(eventRepository) {
      this.eventRepository = eventRepository;
    }
    async execute(actorId,isAdmin) {
      if(isAdmin) {
        return this.eventRepository.list();
      }
      return this.eventRepository.listForUser(actorId);
    }
  }
  module.exports = ListEventsUseCase;