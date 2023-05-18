/* eslint-disable no-console */
import { getMongoClient } from '../../mongoClient.js';
import Node from './Node.js';
import { v4 as uuidv4 } from 'uuid';

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

    this.nodes = documents[0].nodes;
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
}

export default NodeRepo;
