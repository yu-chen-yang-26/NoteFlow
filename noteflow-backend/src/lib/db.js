/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-mutable-exports */
import dotenv from 'dotenv';
import knex from 'knex';
import knexfile from '../database/postgres/knexfile.js';

let db;
dotenv.config({ path: '/config/.env' });

if (
    process.env.NODE_ENV === 'local' ||
    process.env.NODE_ENV === 'development'
) {
    db = knex(knexfile.development);
} else {
    db = knex(knexfile.production);
}

export default db;
