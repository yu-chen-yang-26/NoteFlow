import request from 'supertest';
import knex from 'knex';
import server from '../src/app.js'
import { expect } from 'chai'
import crypto from 'crypto-js';

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

const info = {
  email: 'test123@gmail.com',
  password: crypto.SHA256('test123').toString(),
  name: 'test',
}

describe('Node init', function () {

  let instance = request.agent(server);

  before(async () => {
    const { name, email, password } = info;
    const getter1 = await k("users").first().where({email});

    if(!getter1){
      await request(server)
      .post('/api/user/register')
      .send({
        user: {
          name,
          email,
          password,
        },
      });
    }

    await instance
      .post('/api/user/login')
      .send({
        user: {
          name,
          email,
          password
        },
      });
  })

  it('api: /api/nodes/new-node', async () => {
    const res = await instance.post("/api/nodes/new-node").send();
    expect(res.status).equal(200);
  })
});

describe('Node service', function () {

  let instance = request.agent(server);
  let nodeId;
  
  before(async () => {
    const { name, email, password } = info;
    const getter1 = await k("users").first().where({email});

    if(!getter1){
      await request(server)
      .post('/api/user/register')
      .send({
        user: {
          name,
          email,
          password,
        },
      });
    }

    await instance
      .post('/api/user/login')
      .send({
        user: {
          name,
          email,
          password
        },
      });

    const res = await instance.post("/api/nodes/new-node").send();
    nodeId = JSON.parse(res.text);
  })

  it('api: /api/nodes/get-colab-list', async () => {
    await instance.get('/api/nodes/get-colab-list').expect(422).send();

    const res2 = await instance.get(`/api/nodes/get-colab-list?id=${nodeId}`).send();
    expect(res2.status).equal(200);
    expect(res2.text).equal(`["${info.email}"]`)
  })

  // it('api: /api/nodes/revise-colab-list', async () => {
  //   await instance.get('/api/nodes/get-colab-list').expect(422).send();
  // })

  it('api: /api/nodes/get-title', async () => {
    await instance.get('/api/nodes/get-title').expect(422).send();
    const res = await instance.get(`/api/nodes/get-title?id=${nodeId}`).send();

    expect(res.status).equal(200);
    expect(JSON.parse(res.text)).equal("Untitled");
  })

  it('api: /api/nodes/set-title', async () => {
    const target = Math.random().toString(15);

    const res1 = await instance.post('/api/nodes/set-title').send({
      id: nodeId,
      title: target,
    })

    expect(res1.status).equal(200);
    
    const res2 = await instance.get(`/api/nodes/get-title?id=${nodeId}`).send();
    expect(JSON.parse(res2.text)).equal(target)
  })
});
