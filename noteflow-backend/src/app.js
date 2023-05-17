/* eslint-disable import/no-extraneous-dependencies */
import Koa from 'koa';
import { koaBody } from 'koa-body';

import logger from 'koa-logger';
import { WebSocketServer } from 'ws';
import https from 'https';
import http from 'http';
import koaSslify from 'koa-sslify';

import cors from '@koa/cors';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import path from 'path';
import fs from 'fs';
import koaStatic from 'koa-static';
import send from 'koa-send';

import sharedb from './model/mongodb/sharedb.js';
import redisClient from './model/redis/redisClient.js';
import routes from './routes/index.js';
import redisSession from './model/redis/redisSession.js';
import WsRouter from './routes/ws-router.js';

const app = new Koa();

const { default: sslify } = koaSslify;
app.use(sslify());

app.use(logger());
app.use(
  cors({
    origin: '*',
    credentials: true,
    allowMethods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type'],
    exposeHeaders: [
      'Authorization',
      'set-cookie',
      'access-control-allow-origin',
      'access-control-allow-credentials',
    ],
    keepHeadersOnError: true,
  }),
);

app.use(redisSession(app));

app.use(koaBody());
app.use(routes.allowedMethods());

const server = https.createServer(
  {
    key: fs.readFileSync('./config/cert/server.key'),
    cert: fs.readFileSync('./config/cert/server.cert'),
  },
  app.callback(),
);

const wsServer = new WebSocketServer({ server });

app.use(async (ctx, next) => {
  if (server instanceof http.Server) {
    const { user } = ctx.request.body;
    ctx.session = user ? { ...user } : ctx.session;
  }
  await next();
});

app.use(routes.routes());
// app.use(koaServe({ rootPath: '/', rootDir: 'dist' }));
app.use(koaStatic(path.join(process.cwd(), 'dist')));
app.use(async (ctx) => {
  await send(ctx, 'index.html', { root: path.join(process.cwd(), 'dist') });
});

const router = new WsRouter()
  .no_session('/registerNodeColab', (ws) => {
    ws.on('message', async (message) => {
      try {
        const query = JSON.parse(message.toString('utf-8'));
        await redisClient.set(`${query.nodeId}-${query.email}`, 1, 'EX', 3);
        const keys = await redisClient.keys(`${query.nodeId}-*`);
        ws.send(JSON.stringify(keys));
      } catch (e) {
        ws.close(1001);
      }
    });
  })
  .session('/flow', 'Flow', (ws) => {
    const stream = new WebSocketJSONStream(ws);
    sharedb.listen(stream);
  })
  .no_session('/node', (ws) => {
    const stream = new WebSocketJSONStream(ws);
    sharedb.listen(stream);
  });

wsServer.on('connection', (ws, req) => {
  router.serve(ws, req);
});

server.listen(3000);

console.log('Listening!');

export default server;
