import { getMongoClient } from '../../mongoClient.js';
import Flow from './Flow.js';

class Flows {
  constructor(user) {
    if (!/@/.test(user)) {
      throw Error('User needs to be an email.');
    }
    this.user = user;
    this.flows = [];
  }

  static async genFlowsProfile(userEmail) {
    const result = {
      user: userEmail,
      flows: [],
    };

    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');
    if (await collection.findOne({ user: result.user })) {
      return; // We have created for this user.
    }
    await collection.insertOne(result);

    await mongoClient.close();
  }

  async addFlow() {
    const mongoClient = getMongoClient();
    const flowId = await Flow.generateFlowId();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');

    const flow = new Flow(flowId, '', this.user);
    await collection.insertOne({ ...flow });

    await mongoClient.close();
  }

  static async fetchFlowsByFlowList(flowList) {
    const requestMapper = {};
    flowList.forEach((element) => {
      if (!(element.owner in requestMapper)) {
        requestMapper[element.owner] = [];
      }
      requestMapper[element.owner].push(element.flowId);
    });

    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');

    let result = [];
    for (let key of Object.keys(requestMapper)) {
      const resolved = await collection
        .aggregate([
          { $match: { user: key } },
          { $limit: 1 },
          { $unwind: '$flows' },
          { $match: { 'flows.id': { $in: requestMapper[key] } } },
          // 篩選
          {
            $project: {
              'flows.id': 1,
              'flows.name': 1,
              'flows.thumbnail': 1,
              'flows.updateAt': 1,
            },
          },
          { $replaceRoot: { newRoot: '$flows' } },
        ])
        .toArray();
      result = result.concat(resolved);
    }

    await mongoClient.close();

    return result;
  }

  static async fetchColaborators(owner, flowId) {
    const mongoClient = getMongoClient();
    await mongoClient.connect();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');

    const resolved = await collection
      .aggregate([
        { $match: { user: owner } },
        { $limit: 1 },
        { $unwind: '$flows' },
        { $match: { 'flows.id': { $eq: flowId } } },
        { $replaceRoot: { newRoot: '$flows' } },
      ])
      .toArray();

    await mongoClient.close();

    return resolved[0].colaborators;
  }
}

export default Flows;
