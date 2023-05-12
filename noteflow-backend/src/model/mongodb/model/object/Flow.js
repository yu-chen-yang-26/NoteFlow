/* eslint-disable no-await-in-loop */
/* eslint-disable no-lonely-if */
/* eslint-disable import/no-extraneous-dependencies */
import { v4 as uuidv4 } from 'uuid';
import sharedb from '../../sharedb.js';
import { getMongoClient } from '../../mongoClient.js';
import FlowList from './FlowList.js';
import _ from 'lodash';
import json1 from 'ot-json1';

class Flow {
  constructor(
    flowId,
    flowName,
    owner,
    colaborators = null,
    thumbnail = '',
    nodes = [],
    edges = [],
  ) {
    // if(content instanceof ...) throw NotContentError...;
    this.id = flowId;
    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      throw Error('');
    }
    this.name = flowName;
    this.thumbnail = thumbnail;
    this.owner = owner;
    this.nodes = nodes;
    this.edges = edges;
    this.colaborators = Array.isArray(colaborators)
      ? colaborators
      : [this.owner];

    if (!this.name || !this.name === '') {
      this.name = 'Untitled';
    }
  }

  // 會順便連 flow preview 也一起存起來

  async newify() {
    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');

    const result = await collection.findOneAndUpdate(
      {
        user: this.owner,
      },
      {
        $addToSet: {
          flows: _.omit({ ...this, updateAt: Date.now() }, [
            'owner',
            'edges',
            'nodes',
          ]),
        },
      },
    );
    await mongoClient.close();
    const flowList = new FlowList(this.owner);
    await flowList.addSomebodyToFlowList(this.owner, this.id);
    await this.newify_sharedb();
  }

  async newify_sharedb() {
    const connection = sharedb.connect();
    const doc = connection.get('flow-sharedb', this.id);
    doc.fetch((err) => {
      if (err) throw err;
      if (doc.type === null) {
        doc.create({ nodes: {}, edges: {}, name: 'Undefined' }, json1.type.uri);
      }
    });
  }

  static async CanUserEdit(flowId, owner, target) {
    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');
    const resolved = await collection
      .aggregate([
        { $match: { user: owner } },
        { $limit: 1 },
        { $unwind: '$flows' },
        { $match: { 'flows.id': flowId } },
      ])
      .toArray();
    await mongoClient.close();
    return resolved[0].flows.colaborators.includes(target);
  }

  static async generateFlowId(owner) {
    let resolved = false;
    let newUuid;
    while (!resolved) {
      newUuid = `${owner}-flow-${uuidv4()}`;
      const mongoClient = getMongoClient();
      await mongoClient.connect();
      const database = mongoClient.db('noteflow');
      const collection = database.collection('flows');

      const result = await collection.findOne({
        user: owner,
        flows: { $elemMatch: { flowId: newUuid } },
      });
      if (!result) {
        resolved = true;
      }
      await mongoClient.close();
    }
    return newUuid;
  }

  static async refreshColabs(flowId, add = [], remove = []) {
    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');

    const owner = flowId.split('-')[0];
    if (add.length !== 0) {
      await collection.findOneAndUpdate(
        {
          user: owner,
          'flows.id': flowId,
        },
        {
          $addToSet: { 'flows.$.colaborators': { $each: add } },
        },
      );
    }

    await collection.findOneAndUpdate(
      {
        user: owner,
        'flows.id': flowId,
      },
      {
        $pull: { 'flows.$.colaborators': { $in: remove } },
      },
    );
    // eslint-disable-next-line no-empty

    await mongoClient.close();
  }
}

export default Flow;

// async storeFlow() {
//   const mongoClient = getMongoClient()
//   await mongoClient.connect();
//   const database = mongoClient.db('noteflow');
//   const collection = database.collection('flows');

//   await collection.findOneAndUpdate(
//     {
//       user: this.user,
//     },
//     {
//       $set: { "flows.$": {...this, updateAt: Date.now()}},
//       $addToSet: {
//         flows: {
//           ...this,
//           updateAt: Date.now(),
//         }
//       }
//     }
//   );

//   const flowPrev = new FlowPreview(this.flowId, this.flowName, this.owner);
//   flowPrev.storeFlow();
// }

// static async addComponent(flowId, owner, type, component) {
//   const mongoClient = getMongoClient()
//   await mongoClient.connect();
//   const database = mongoClient.db('noteflow');
//   const collection = database.collection('flows');

//   const result = await collection.findOneAndUpdate(
//     {
//       user: owner,
//       "flows.flowId": flowId,
//     },
//     {
//       $addToSet: {
//         [`flows.$.${type}`]: {
//           ...component,
//           updateAt: Date.now()
//         }
//       }
//     },
//     {
//       returnDocument: true,
//     }
//   )

//   if(!result) {
//     throw Error('Flow not found');
//   }
// }

// static async removeComponent(flowId, owner, type, component) {
//   const mongoClient = getMongoClient()
//   await mongoClient.connect();
//   const database = mongoClient.db('noteflow');
//   const collection = database.collection('flows');

//   const result = await collection.findOneAndDelete(
//     {
//       user: owner,
//       "flows.flowId": flowId,
//     },
//     {
//       $pull: {
//         [`flows.$.${type}`]: {
//           id: { $eq: component.id }
//         }
//       }
//     },
//     {
//       returnDocument: true,
//     }
//   )

//   if(!result) {
//     throw Error('Flow not found');
//   }
// }

// static async alterComponent(flowId, owner, type, component) {
//   const mongoClient = getMongoClient()
//   await mongoClient.connect();
//   const database = mongoClient.db('noteflow');
//   const collection = database.collection('flows');

//   const changed = type === 'title' ? component : {
//     ...component,
//     updateAt: Date.now()
//   };

//   const result = await collection.findOneAndUpdate(
//     {
//       user: owner,
//       "flows.flowId": flowId,
//     },
//     {
//       $set: {
//         [`flows.$.${type}`]: changed
//       }
//     },
//     {
//       returnDocument: true,
//     }
//   )

//   if(!result) {
//     throw Error('Flow not found');
//   }
// }
// static async fetchFlow(userId, flowId) {
//   const mongoClient = getMongoClient()
//   await mongoClient.connect();
//   const database = mongoClient.db('noteflow');
//   const collection = database.collection('flows');

//   const resolved = await collection.aggregate([
//     {$match: {user: userId}},
//     {$limit: 1},
//     {$unwind: "$flows"},
//     {$match:{'flows.id': flowId}},
//   ]).toArray()

//   await mongoClient.close();

//   return resolved[0];
// }
