/* eslint-disable no-console */
import { v4 as uuidv4 } from 'uuid';
import { getMongoClient } from '../../mongoClient.js';
import Node from './Node.js';

class NodeRepo {
  constructor(user) {
    if (!/@/.test(user)) {
      throw Error('User needs to be an email.');
    }
    this.user = user;
    this.nodes = [];
  }

  static async genNodeRepoProfile(userEmail) {
    const result = {
      user: userEmail,
      nodes: [],
    };

    const mongoClient = await getMongoClient().connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');
    if (await collection.findOne({ user: result.user })) {
      return; // We have created for this user.
    }

    await collection.insertOne(result);
    await mongoClient.close();
  }

  async fetchNodes(query = { user: this.user }, options = {}) {
    const mongoClient = getMongoClient();
    // 不需要 try：有問題 controller 層會 catch
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');

    const cursor = collection.find(query, options);
    const documents = await cursor.toArray();

    await mongoClient.close();

    this.nodes = documents.nodes;
  }

  async newNode() {
    /**
     * journey:
     *  1. In flow: create new node
     *  2. Get permission from here
     *  3. Produce a ref to the flow
     */
    const nodeId = await this.generateNodeId(this.user);
    const node = new Node(nodeId, 'customNode', this.user);

    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');

    await collection.findOneAndUpdate(
      {
        user: this.user,
      },
      {
        $addToSet: { nodes: { ...node } },
      },
    );

    await mongoClient.close();

    node.addEditor();

    return nodeId;
  }

  async generateNodeId() {
    let resolved = false;
    let newUuid;
    while (!resolved) {
      newUuid = `${this.user}-node-${uuidv4()}`;
      const mongoClient = getMongoClient();
      await mongoClient.connect();
      const database = mongoClient.db('noteflow');
      const collection = database.collection('nodeRepo');

      const result = await collection.findOne({
        user: this.user,
        nodes: { $elemMatch: { nodeId: newUuid } },
      });
      if (!result) {
        resolved = true;
      }
      await mongoClient.close();
    }
    return newUuid;
  }

  static async refreshColabs(nodeId, add = [], remove = []) {
    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('NodeRepository');

    const owner = nodeId.split('-')[0];
    if (add.length !== 0) {
      await collection.findOneAndUpdate(
        {
          user: owner,
          'nodes.id': nodeId,
        },
        {
          $addToSet: { 'nodes.$.colaborators': { $each: add } },
        },
      );
    }

    await collection.findOneAndUpdate(
      {
        user: owner,
        'nodes.id': nodeId,
      },
      {
        $pull: { 'nodes.$.colaborators': { $in: remove } },
      },
    );

    await mongoClient.close();
  }

  static async setTitle(nodeId, newTitle) {
    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');

    const owner = nodeId.split('-')[0];

    await collection.findOneAndUpdate(
      {
        user: owner,
        'nodes.id': newTitle,
      },
      {
        $set: { 'nodes.$.name': newTitle },
      },
    );
    await mongoClient.close();
  }

  static async getTitle(nodeId) {
    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');

    const owner = nodeId.split('-')[0];
    const resolved = await collection
      .aggregate([
        { $match: { user: owner } },
        { $limit: 1 },
        { $unwind: '$nodes' },
        { $match: { 'nodes.id': nodeId } },
      ])
      .toArray();

    await mongoClient.close();
    return resolved[0].name;
  }
}

export default NodeRepo;
