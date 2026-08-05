class EventRepositoryPort {
    async create(data) {
        throw new Error('EventRepositoryPort.create is not implemented');
    }
    async findById(id) {
        throw new Error('EventRepositoryPort.findById is not implemented');
    }
    async findByOrganizerId(organizerId) {
        throw new Error('EventRepositoryPort.findByOrganizerId is not implemented');
    }
    async findByTitle(title) {
        throw new Error('EventRepositoryPort.findByTitle is not implemented');
    }
}
module.exports = EventRepositoryPort;