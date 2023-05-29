import request from 'supertest';
import knex from 'knex';
const baseUrl = 'http://localhost';

beforeEach(async () => {
  jest.setTimeout(30000);
  const getter = await k("users").first().where({email: "test123@gmail.com"});

  if(getter){
    await k("users").where({email: "test123@gmail.com"}).del();
  }

});

const k = knex({
  client: 'pg',
  connection: {
    host: "localhost",
    port: 5432,
    user: "user",
    password: "112a",
    database: "noteflow",
  },
});

describe('userService API', function () {
  test('api: /api/user/register', async () => {
    const res = await request(baseUrl)
      .post('/api/user/register')
      .send({
        user: {
          name: Math.random().toString(20),
          email: 'test123@gmail.com',
          password: Math.random().toString(20),
        },
      });
    expect(res.statusCode).toEqual(200);
  });


  test('api: /api/user/login', async () => {
    const res = await request(baseUrl)
      .post('/api/user/login')
      .send({
        user: {
          name: 'test22',
          email: 'test22@gmail.com',
          password: 'test22',
        },
      });
    expect(res.statusCode).toEqual(200);
  });

  test('api: /api/user/google-login', async () => {
    const res = await request(baseUrl)
      .post('/api/user/google-login')
      .send({
        user: {
          email: 'test22@gmail.com',
        },
      });
      expect(res.statusCode).toEqual(200);
  });

  test('api: /api/user/who-am-i', async () => {
    const res = await request(baseUrl)
      .get('/api/user/who-am-i')
      .send({
        user: {
          email: 'test22@gmail.com',
        },
      });
      expect(res.statusCode).toEqual(200);
  });

  test('api: /api/user/verify', async () => {
    const res = await request(baseUrl)
      .get('/api/user/verify')
      .send({
        user: {
          id: '1',
        },
      });
      expect(res.statusCode).toEqual(200);
  });

  // test('api: /api/user/get-photo-url', async () => {
  //   const res = await request(baseUrl)
  //     .get('/api/user/get-photo-url')
  //     .send();
  //     expect(res.statusCode).toEqual(200);
  // });
});
