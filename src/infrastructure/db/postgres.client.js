
const env = require('../../config/env');
const { Pool } = require('pg');

const pool =new Pool({
    user: env.db.user,
    host: env.db.host,
    database: env.db.name,
    password: env.db.password,
    port: env.db.port,
});

module.exports = pool;