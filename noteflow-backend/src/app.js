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
import redisSession, { getSession } from './model/redis/redisSession.js';
import { Flow, Node } from './model/mongodb/model/index.js';

const app = new Koa();

const { default: sslify } = koaSslify;
app.use(sslify());

app.use(logger());
app.use(
  cors({
    origin: '*',
    exposeHeaders: ['Authorization'],
    credentials: true,
    allowMethods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type'],
    exposeHeaders: [
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

wsServer.on('close', async (ws, req) => {
  console.log('close:', req.url);
  await ws.close(1000);
});
wsServer.on('connection', async (ws, req) => {
  // 某一個特定的人進來了這個地方，ws 裡面應該會存放有這個用戶的 sid & cookie
  const requests = req.url.split('?');
  const url_list = requests[0].split('/');
  const url = '/' + url_list[url_list.length - 1];
  const query = requests[1];
  if (url === '/registerNodeColab') {
    // 展示卡比獸們
    // getSession(req.headers.cookie)
    //     .then((sess) => {
    //         try {
    //             const email = sess.email;
    //             const params = new URLSearchParams(query);

    //             console.log(email);

    //             Node.CanUserEdit(
    //                 params.get('id'),
    //                 params.get('id').split('-')[0],
    //                 email
    //             )
    //                 .then((can) => {
    //                     if (!can) {
    //                         // Unauthorized. 你沒有權限進入這個 component
    //                         ws.close(1000);
    //                     }
    //                 })
    //                 .catch((e) => {
    //                     // Component not exists. 嘗試讀取不存在的 List
    //                     // ws.send(1001);
    //                     ws.close(1001);
    //                 });
    //         } catch (e) {
    //             // Internal Server Error
    //             ws.close(4999);
    //         }
    //     })
    //     .catch((e) => {
    //         // You have no session. 我不認識你
    //         ws.close(1002, 'Unauthorized.');
    //     });

    ws.on('message', async (message) => {
      try {
        const query = JSON.parse(message.toString('utf-8'));
        await redisClient.set(`${query.nodeId}-${query.email}`, 1, 'EX', 3);
        const keys = await redisClient.keys(`${query.nodeId}-*`);
        if (ws.readyState !== ws.OPEN) return;
        ws.send(JSON.stringify(keys));
      } catch (e) {
        ws.close(1000);
      }
    });
  } else if (url === '/flow') {
    // flow 裡面的協作
    let agent;
    getSession(req.headers.cookie)
      .then((sess) => {
        try {
          const email = sess.email;
          const params = new URLSearchParams(query);
          Flow.CanUserEdit(
            params.get('id'),
            params.get('id').split('-')[0],
            email,
          )
            .then((can) => {
              if (can) {
                try {
                  const stream = new WebSocketJSONStream(ws);
                  agent = sharedb.listen(stream);
                  ws.on('close', () => {
                    agent.close();
                  });
                } catch (e) {
                  ws.close(1000);
                }
              } else {
                // Unauthorized. 你沒有權限進入這個 component
                ws.close(1000);
              }
            })
            .catch((e) => {
              // Component not exists. 嘗試讀取不存在的 List
              ws.close(1001);
            });
        } catch (e) {
          // Internal Server Error
          ws.close(4999);
        }
      })
      .catch((e) => {
        // You have no session. 我不認識你
        ws.close(1002, 'Unauthorized.');
      });
  } else {
    // node edit
    console.log(req.url);
    let agent;
    try {
      const stream = new WebSocketJSONStream(ws);
      agent = sharedb.listen(stream);
      ws.on('close', () => {
        agent.close();
      });
    } catch (e) {
      ws.close(1000);
      await agent.close();
    }
    // getSession(req.headers.cookie)
    //     .then((sess) => {
    //         try {
    //             const email = sess.email;
    //             const params = new URLSearchParams(query);
    //             Node.CanUserEdit(
    //                 params.get('id'),
    //                 params.get('id').split('-')[0],
    //                 email
    //             )
    //                 .then((can) => {
    //                     if (can) {
    //                         const stream = new WebSocketJSONStream(ws);
    //                         sharedb.listen(stream);
    //                     } else {
    //                         // Unauthorized. 你沒有權限進入這個 component
    //                         ws.close(1000);
    //                     }
    //                 })
    //                 .catch((e) => {
    //                     // Component not exists. 嘗試讀取不存在的 List
    //                     ws.close(1001);
    //                 });
    //         } catch (e) {
    //             // Internal Server Error
    //             ws.close(4999);
    //         }
    //     })
    //     .catch((e) => {
    //         // You have no session. 我不認識你
    //         ws.close(1002, 'Unauthorized.');
    //     });
  }
});

server.listen(3000);

export default server;
