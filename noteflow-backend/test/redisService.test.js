// import redisClient, { newRedisClient } from '../src/model/redis/redisClient.js';

// let redisListener;

// beforeAll(async () => {
//   redisListener = newRedisClient();
// });

// afterAll(async () => {
//   if (redisListener) {
//     redisListener.disconnect();
//   }
// });

// describe('Single redisServer', () => {
//   test('should start redis server', async () => {
//     expect(redisListener).toBeDefined();
//     expect(await redisListener.ping()).toBe('PONG');
//   });
// });
