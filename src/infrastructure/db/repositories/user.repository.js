const UserRepositoryPort = require('../../../application/ports/user.repository.port');
const BaseRepository = require('./base.repository');
const User = require('../../../domain/entities/User');
class UserRepository extends UserRepositoryPort {
    constructor(pool) {
        super();
        this.baseRepository = new BaseRepository(pool);
    }
    toEntity(row) {
        return new User({
            id: row.id,
            name: row.name,
            email: row.email,
            passwordHash: row.password_hash,
            isAdmin: row.is_admin,
            timezone: row.timezone,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }); 
    }
    async create(user) {
        const result = await this.baseRepository.query(
            `INSERT INTO users (name, email, password_hash, is_admin, timezone)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                user.name,
                user.email,
                user.passwordHash,
                user.isAdmin ?? false,
                user.timezone ?? 'UTC',
            ]
        );
        return this.baseRepository.mapone(result, this.toEntity);
    }
    async findById(id) {
        const result = await this.baseRepository.query('SELECT * FROM users WHERE id = $1', [id]);
        return this.baseRepository.mapone(result, this.toEntity);
    }
    async findByEmail(email) {
        const result = await this.baseRepository.query('SELECT * FROM users WHERE email = $1', [email]);
        return this.baseRepository.mapone(result, this.toEntity);
    }
    async update(id, user) {
        const result = await this.baseRepository.query(
            `UPDATE users
             SET name = $1,
                 email = $2,
                 password_hash = $3,
                 is_admin = $4,
                 timezone = $5,
                 updated_at = NOW()
             WHERE id = $6
             RETURNING *`,
            [
                user.name,
                user.email,
                user.passwordHash,
                user.isAdmin,
                user.timezone,
                id,
            ]
        );
        if (result.rowCount === 0) {
            return null;
        }
        return this.baseRepository.mapone(result, this.toEntity);
    }
    async delete(id) {
        const result = await this.baseRepository.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if(result.rowCount === 0) {
            return null;
        }
        return this.baseRepository.mapone(result, this.toEntity);
    }
}
module.exports = UserRepository;