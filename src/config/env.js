const path = require('path');
require('dotenv').config()
function requiredEnv(env) {
    const value = process.env[env];
    if (!value) {
        throw new Error(`Environment variable ${env} is not set`);
    }
    return value;
}

module.exports = {
    port: requiredEnv('PORT'),
    requiredEnv
}