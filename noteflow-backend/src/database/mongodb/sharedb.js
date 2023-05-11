/* eslint-disable import/no-extraneous-dependencies */
import ShareDB from 'sharedb';
import richText from 'rich-text';
import sharedb_mongo from 'sharedb-mongo';

import RedisPubSub from 'sharedb-redis-pubsub';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';
import json1 from 'ot-json1';

dotenv.config({ path: `${process.cwd()}/config/.env.development` });

// initialize redis client
// eslint-disable-next-line object-curly-newline
const { REDIS_ACCOUNT, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;

const redisClient = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    // password: REDIS_PASSWORD,
    // username: REDIS_ACCOUNT,
    // enableReadyCheck: false,
});

const redisObserver = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    // password: REDIS_PASSWORD,
    // username: REDIS_ACCOUNT,
    // enableReadyCheck: false,
});

// initialize mongodb client
const {
    MONGO_NOTEFLOW_USERNAME,
    MONGO_NOTEFLOW_PASSWORD,
    MONGO_HOST,
    MONGO_PORT,
} = process.env;

ShareDB.types.register(json1.type);
ShareDB.types.register(richText.type); // allow sharedb to colab with rich text format
const sharedb = new ShareDB({
    presence: true,
    doNotForwardSendPresenceErrorsToClient: true,
    pubsub: RedisPubSub({ client: redisClient, observer: redisObserver }),
    db: sharedb_mongo(
        `mongodb://${MONGO_NOTEFLOW_USERNAME}:${MONGO_NOTEFLOW_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/noteflow`,
        { useUnifiedTopology: true, maxPoolSize: 10, useNewUrlParser: true }
    ),
});

export default sharedb;
export { redisClient };
