const express = require('express');
const env = require('./src/config/env');
const app = express();
const poolConfig = require('./src/infrastructure/db/postgres.client');
const pool = require('./src/infrastructure/db/postgres.client');

app.get('/', (req, res) => {
  res.send('Hello World!');
});
async function start() {
    try {
        await pool.query('SELECT 1');
        console.log('Database connected to ${env.db.host}:${env.db.port}/${env.db.name}');
        app.listen(env.port, () => {
            console.log(`Example app listening on port ${env.port}`);
        });
    } catch (err) {
        console.error('Error connecting to database', err);
    }
}
start();