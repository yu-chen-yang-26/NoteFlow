import request from 'supertest';
import knex from 'knex';

let app, server, wsServer, mongoServer, uri;
const baseUrl = 'http://localhost';

describe('api: /api/swagger', function () {
  test('api: /api/swagger', async () => {
    const res = await request(baseUrl).get('/api/swagger').send();
    expect(res.status).toBe(200);
  });

  test('api: /not-found', async () => {
    const res = await request(baseUrl).get('/not-found').send();
    expect(res.status).toEqual(404);
  });

  test('api: /api/not-found', async () => {
    const res = await request(baseUrl).get('/api/not-found').send();
    expect(res.status).toEqual(404);
  });

  test('api: /api/reset-redis', async () => {
    const res = await request(baseUrl)
      .get('/api/reset-redis')
      .send();
      expect(res.statusCode).toEqual(200);
  });
});
