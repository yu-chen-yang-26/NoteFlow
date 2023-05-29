import request from 'supertest';
import knex from 'knex';

let app, server, wsServer, mongoServer, uri;
const baseUrl = 'http://localhost';

describe('API check', function () {
  test('api: /api/swagger', async () => {
    const response = await request(baseUrl).get('/api/swagger').send();
    expect(response.status).toBe(200);
  });

});
