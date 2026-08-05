
require('dotenv').config()
function requiredEnv(env) {
    const value = process.env[env];
    if (!value) {
        throw new Error(`Environment variable ${env} is not set`);
    }
    return value;
}

module.exports = {
    port: Number(requiredEnv('PORT')),
    db: {
        user: requiredEnv('DB_USER'),
        host: requiredEnv('DB_HOST'),
        name: requiredEnv('DB_NAME'),
        password: requiredEnv('DB_PASSWORD'),
        port: Number(requiredEnv('DB_PORT')),
    },
    jwt: {
        secret: requiredEnv('JWT_SECRET'),
        expiration: requiredEnv('JWT_EXPIRATION'),
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
}
