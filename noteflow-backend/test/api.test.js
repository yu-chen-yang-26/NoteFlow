import request from 'supertest';
import routes from '../src/routes/index.js';
import bodyParser from 'body-parser';
import Koa from 'koa';
import { koaBody } from 'koa-body';
import redisSession from '../src/model/redis/redisSession.js';
import http from 'http';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import db from '../src/lib/db.js';

let app, server, wsServer, mongoServer, uri;
const baseUrl = 'http://localhost:9999';

app = new Koa();
app.use(koaBody());
app.use(redisSession(app));
app.use(routes.routes());
server = http.createServer(app.callback());

const startServer = () => {
  server.listen(9999);
};

const closeServer = () => {
  server.close();
};

const startMongoServer = async () => {
  const mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri(), {
    dbName: 'noteflow',
  });
};

const stopMongoServer = async () => {
  await mongoose.disconnect();
};

beforeAll(async () => {
  startServer();
  await startMongoServer();
});

beforeEach(function () {
  var unhandledException = undefined;
  var unhandledExceptionCallback = function (err) {
    unhandledException = err;
  };
  process.on('uncaughtException', unhandledExceptionCallback);
});

afterAll(async () => {
  closeServer();
  await stopMongoServer();
});

describe('API check', function () {
  test('api: /api/swagger', async () => {
    const response = await request(baseUrl).get('/api/swagger').send();
    expect(response.status).toBe(200);
  });

});
