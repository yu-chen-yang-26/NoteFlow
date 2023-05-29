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
    expect(res.body).toHaveProperty('user');
  });

  test('api: /api/user/login', async () => {

    const response = await request(baseUrl)
      .post('/api/user/login')
      .send({
        user: {
          name: 'test',
          email: 'test@gmail.com',
          password: 'test',
        },
      })
      .expect(200)
      .end((err, res) => {
        process.removeListener('uncaughtException', unhandledExceptionCallback);
        if (unhandledException !== undefined) {
          return done(unhandledException);
        } else if (err) {
          return done(err);
        }
        newGame = res.body;
        done();
      });

    expect(response.status).toBe(200);

    // const updatedCnt = await User.countDocuments();
    // expect(updatedCnt).toBe(cnt + 1);
  });

  test('api: /api/user/login', async () => {
    const response = await request(baseUrl)
      .post('/api/user/login')
      .send({
        user: {
          name: 'test',
          email: 'test@gmail.com',
          password: 'test',
        },
      });
    expect(response.status).toBe(200);
  });

  test('api: /api/user/google-login', async () => {
    const response = await request(baseUrl)
      .post('/api/user/google-login')
      .send({
        user: {
          email: 'test@gmail.com',
        },
      });
    expect(response.status).toBe(200);
  });

  test('api: /api/user/update', async () => {
    const response = await request(baseUrl)
      .post('/api/user/update')
      .send({
        user: {
          name: 'test1',
          email: 'test@gmail.com',
        },
      });
    expect(response.status).toBe(200);
  });

  test('api: /api/user/verify/{userId}/{token}', async () => {
    const response = await request(baseUrl)
      .get('/api/user/verify/{userId}/{token}')
      .send({
        user: {
          name: 'test1',
          email: 'test@gmail.com',
        },
      });
    expect(response.status).toBe(200);
  });
});
