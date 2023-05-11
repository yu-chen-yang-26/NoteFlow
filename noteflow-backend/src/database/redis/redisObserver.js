import * as dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config({ path: `${process.cwd()}/config/.env.development` });
const { REDIS_ACCOUNT, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;

// initialize redis observer
const redisObserver = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  // password: REDIS_PASSWORD,
  // username: REDIS_ACCOUNT,
  // enableReadyCheck: false,
});

export default redisObserver;
