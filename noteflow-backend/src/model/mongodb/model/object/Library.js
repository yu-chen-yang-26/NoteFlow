// import Node from './Node.js';
import { getMongoClient } from '../../mongoClient.js';
import NodeRepo from './NodeRepo.js';

class Library {
  constructor(user) {
    this.user = user;
    this.nodes = [];
  }

  static async genLibraryProfile(email) {
    const result = {
      user: email,
      nodes: [],
    };

    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('library');

    if (await collection.findOne({ user: result.user })) {
      return; // We have created for this user.
    }
    await collection.insertOne(result);
  }

  static async fetchNodes(user) {
    const mongoClient = getMongoClient();
    // 不需要 try：有問題 controller 層會 catch

    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');

    // 先拿到 { userId: ..., nodes: ...}
    const result = await collection.findOne({ user });

    if (!result) {
      await Library.genLibraryProfile(user);
      return [];
    }

    const nodesFromLib = result.nodes.map((data) => data.id);
    const nodes = await NodeRepo.fetchNodes(user, nodesFromLib);

    return nodes;
  }

  static async isFavorite(user, nodeId) {
    const mongoClient = getMongoClient();
    // 不需要 try：有問題 controller 層會 catch

    const database = mongoClient.db('noteflow');
    const collection = database.collection('library');

    // 先拿到 { userId: ..., nodes: ...}
    const result = await collection.findOne({ user, 'nodes.id': nodeId });

    return !!result;
  }

  static async addNode(id, email) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('library');

    await collection.findOneAndUpdate(
      {
        user: email,
      },
      {
        $addToSet: { nodes: { id, addTime: Date.now() } },
      },
    );
  }

  static async removeNode(id, email) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('library');

    await collection.findOneAndDelete({
      user: email,
      'nodes.id': id,
    });
  }
}

export default Library;
