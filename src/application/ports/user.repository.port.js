class UserRepositoryPort {
    /**
     * Create a new user
     * @param {Object} data
     * @returns {Promise<import('../../domain/entities/User')>}
     */
    async create(data) {
        throw new Error('Not implemented');
    }
    /**
     * Find a user by id
     * @param {string} id
     * @returns {Promise<import('../../domain/entities/User')>}
     */
    async findById(id) {
        throw new Error('Not implemented');
    }
    /**
     * Find a user by email
     * @param {string} email
        * @returns {Promise<import('../../domain/entities/User')>}
     */
    async findByEmail(email) {
        throw new Error('Not implemented');
    }
 
}
module.exports = UserRepositoryPort;