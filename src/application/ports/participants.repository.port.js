class ParticipantsRepositoryPort {
    async create(data) {
        throw new Error('ParticipantsRepositoryPort.create() is not implemented');
    }
    async findById(id) {
        throw new Error('ParticipantsRepositoryPort.findById() is not implemented');
    }
    async findByEventId(eventId) {
        throw new Error('ParticipantsRepositoryPort.findByEventId() is not implemented');
    }
}
module.exports = ParticipantsRepositoryPort;