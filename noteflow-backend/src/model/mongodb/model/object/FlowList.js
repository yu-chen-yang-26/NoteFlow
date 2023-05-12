/* eslint-disable no-lonely-if */
import { getMongoClient } from '../../mongoClient.js';

class FlowList {
  constructor(user) {
    this.user = user;
    this.flowList = {};
  }

  static async genFlowListProfile(userEmail) {
    const result = {
      user: userEmail,
      flowList: [],
    };

    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flowList');
    if (await collection.findOne({ user: result.user })) {
      return; // We have created for this user.
    }
    await collection.insertOne(result);

    await mongoClient.close();
  }

  async fetchFlowList() {
    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flowList');

    this.flowList = (
      await collection.findOne({
        user: this.user,
      })
    ).flowList;

    await mongoClient.close();
  }

  async addSomebodyToFlowList(userEmail, flowId) {
    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flowList');
    await collection.findOneAndUpdate(
      {
        user: userEmail,
      },
      {
        $addToSet: { flowList: { owner: this.user, flowId } },
      },
    );

    await mongoClient.close();
  }

  // eslint-disable-next-line class-methods-use-this
  async removeSomebodyFromFlowList(userEmail, flowId) {
    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flowList');

    await collection.findOneAndUpdate(
      {
        user: userEmail,
      },
      {
        $pull: { flowList: { flowId: { $eq: flowId } } },
      },
    );

    await mongoClient.close();
  }
}

export default FlowList;
