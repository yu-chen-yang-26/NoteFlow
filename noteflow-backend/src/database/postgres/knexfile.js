import path from 'path';
import * as dotenv from 'dotenv';

const BASE_PATH = `${process.cwd()}`;
dotenv.config({ path: `${BASE_PATH}/../../config/.env.development` });

const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PORT,
    POSTGRES_PASSWORD,
} = process.env;

export default {
    test: {
        client: 'pg',
        connection: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
        migrations: {
            directory: path.join(BASE_PATH, 'postgres', 'migrations'),
        },
        seeds: {
            directory: path.join(BASE_PATH, 'postgres', 'seeds'),
        },
    },
    development: {
        client: 'pg',
        connection: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
        migrations: {
            directory: path.join(BASE_PATH, 'postgres', 'migrations'),
        },
        seeds: {
            directory: path.join(BASE_PATH, 'postgres', 'seeds'),
        },
    },
    production: {
        client: 'pg',
        connection: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
        migrations: {
            directory: path.join(BASE_PATH, 'postgres', 'migrations'),
        },
        seeds: {
            directory: path.join(BASE_PATH, 'postgres', 'seeds'),
        },
    },
};
