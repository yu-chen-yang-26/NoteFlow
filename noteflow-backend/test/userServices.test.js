import request from 'supertest';
import routes from '../src/routes/index.js';
import bodyParser from 'body-parser';
import Koa from 'koa';
import { koaBody } from 'koa-body';
import redisSession from '../src/model/redis/redisSession.js';
import http from 'http';
import mongoose from 'mongoose';
import db from '../src/lib/db.js';
import { getMongoClient } from '../src/model/mongodb/mongoClient.js';

let app, server, wsServer, mongoServer, uri;
const baseUrl = 'https://localhost:9999';

app = new Koa();
app.use(koaBody());
app.use(redisSession(app));
app.use(routes.routes());
server = http.createServer(app.callback());

const startMongodb = () => {
  const mongoClient = getMongoClient();
  const collection = mongoClient.db('noteflow_test').collection('flows');
};

const startServer = () => {
  server.listen(9999);
};

const closeServer = () => {
  server.close();
};

beforeAll(async () => {
  startServer();
  startMongodb();
});

afterAll(async () => {
  closeServer();
});

describe('userService API', function () {
  test('api: /api/user/register', async () => {
    const res = await request(baseUrl)
      .post('/api/user/register')
      .send({
        user: {
          name: 'test',
          email: 'test@gmail.com',
          password: 'test',
        },
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
  });
  // test('api: /api/user/register', async () => {
  //   // const User = mongoose.model('User', new mongoose.Schema({ name: String }));
  //   // const cnt = await User.count();

  //   const response = await request(baseUrl)
  //     .post('/api/user/register')
  //     .send({
  //       user: {
  //         name: 'test',
  //         email: 'test@gmail.com',
  //         password: 'test',
  //       },
  //     })
  //     .expect(200)
  //     .end((err, res) => {
  //       process.removeListener('uncaughtException', unhandledExceptionCallback);
  //       if (unhandledException !== undefined) {
  //         return done(unhandledException);
  //       } else if (err) {
  //         return done(err);
  //       }
  //       newGame = res.body;
  //       done();
  //     });

  //   expect(response.status).toBe(200);

  //   // const updatedCnt = await User.countDocuments();
  //   // expect(updatedCnt).toBe(cnt + 1);
  // });

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
