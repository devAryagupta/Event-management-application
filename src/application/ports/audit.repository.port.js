class AuditRepositoryPort {
    async create(data) {
        throw new Error('AuditRepositoryPort.create() is not implemented');
    }
    async findById(id) {
        throw new Error('AuditRepositoryPort.findById() is not implemented');
    }
    async findByEventId(eventId) {
        throw new Error('AuditRepositoryPort.findByEventId() is not implemented');
    }
}
module.exports = AuditRepositoryPort;