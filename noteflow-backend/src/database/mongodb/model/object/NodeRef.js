/* eslint-disable object-curly-newline */
/* eslint-disable no-console */
import { getMongoClient } from '../../mongoClient.js';
import Node from './Node';

class NodeRef {
  constructor(
    nodeId,
    position,
    positionAbsolute,
    sourcePosition,
    targetPosition,
    width,
    height,
    style,
  ) {
    Object.defineProperties(this, 'nodeId', {
      value: nodeId,
      writrable: false,
    });
    // 因為直接寫在 Flow 中，不需要另外 Fetch
    this.position = position;
    this.positionAbsolute = positionAbsolute;
    this.sourcePosition = sourcePosition;
    this.targetPosition = targetPosition;
    this.width = width;
    this.height = height;
    this.style = style;
    // 或者使用解構賦值傳遞值
    // const myInstance = new MyClass(...Object.values(myObject));
  }

  changeProperty(key, value) {
    if (!(key in Object.keys(this)) || key === 'nodeId' || key === 'node') {
      return false;
    }
    Reflect.set(this, key, value);
    return true;
  }

  async fetchNode(query, options = {}) {
    if (!query || !query.nodeId) {
      throw Error('Please at least specify nodeId in query column');
    }
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');

    const result = await collection.findOne(query, options);

    await mongoClient.close();

    if (!result) {
      throw Error('The node you requested does not exist');
    }

    const { nodeId, type, owner, editor } = result;
    this.node = new Node(nodeId, type, owner, editor);
  }
}

export default NodeRef;
