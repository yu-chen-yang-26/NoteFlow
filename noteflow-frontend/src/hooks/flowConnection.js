import sharedb from 'sharedb/lib/client';
import * as json1 from 'ot-json1';
import ReconnectingWebsocket from 'reconnecting-websocket';
import { BASE_URL } from '../API/api';

sharedb.types.register(json1.type);

class FlowWebSocket {
  constructor(flowId, callback) {
    this.getConnection(flowId, callback);
    // this.lamport = new MutualExclusion();
    this.lastUpdated = Date.now();
  }
  convertFlowData(flow) {
    const toReturn = JSON.parse(JSON.stringify(flow));
    toReturn.edges = Object.values(toReturn.edges);
    toReturn.nodes = Object.values(toReturn.nodes);
    return toReturn;
  }

  getConnection(flowId, callback) {
    const socket = new ReconnectingWebsocket(
      `wss://${BASE_URL}/ws/flow?id=${flowId}`,
    );
    this.socket = socket;

    const collection = 'flow-sharedb';
    const connection = new sharedb.Connection(socket);
    const flow = connection.get(collection, flowId);
    console.log('connecting...');
    flow.subscribe((e) => {
      if (e) throw e;
      console.log('subscribed!');
      this.flow = flow;
      this.flow.on('op', (op) => {
        this.lastOp = op;
        callback(this.convertFlowData(this.flow.data));
      });

      // this.lamport.prepareFlow(flow);
      callback(this.convertFlowData(this.flow.data));
    });
  }

  close(callback) {
    this.socket.close();
    callback(1000);
  }

  addComponent(component, type) {
    const op = [
      json1.insertOp([type === 'node' ? 'nodes' : 'edges', component.id], {
        ...component,
      }),
    ].reduce(json1.type.compose, null);
    this.flow.submitOp(op, (error) => {
      if (error) {
        this.flow.submitOp(op);
      }
    });
  }

  editComponent(param, type) {
    const currentTime = Date.now();
    if (currentTime - this.lastUpdated < 20) return;
    this.lastUpdated = currentTime;
    let op = [];
    let currentNode;
    switch (param[0].type) {
      case 'remove':
        op = [
          json1.removeOp([type === 'node' ? 'nodes' : 'edges', param[0].id]),
        ];
        if (type === 'node') {
          const edgeArr = Object.keys(this.flow.data['edges']);
          console.log(this.flow.data);
          edgeArr.map((id) => {
            if (
              this.flow.data.edges[id].target === param[0].id ||
              this.flow.data.edges[id].source === param[0].id
            ) {
              op.push(json1.removeOp(['edges', id]));
            }
          });
        }
        console.log(op);
        op = op.reduce(json1.type.compose, null);

        break;
      case 'position':
        // 如果 dragging == false 就不做事
        if (type === 'edge') throw Error('窩看不懂');

        currentNode =
          this.flow.data[type === 'node' ? 'nodes' : 'edges'][param[0].id];
        // ncaught TypeError: this.flow.data[(intermediate value)(intermediate value)(intermediate value)].map is not a function
        currentNode.position = param[0].position
          ? param[0].position
          : currentNode.position;

        if (!param[0].dragging) {
          // currentNode.style.border = '2px solid black';
          // console.log('black!');
        }
        op = [
          json1.replaceOp(
            [type === 'node' ? 'nodes' : 'edges', param[0].id.toString()],
            true,
            currentNode,
          ),
        ].reduce(json1.type.compose, null);

        break;
      case 'select':
        // if (type === 'edges') return console.log('窩還沒做 qq');
        currentNode =
          this.flow.data[type === 'node' ? 'nodes' : 'edges'][param[0].id];
        if (param[0].selected) {
          currentNode.style.border = '2px solid orange';
        } else {
          currentNode.style.border = '2px solid black';
        }

        op = [
          json1.replaceOp(
            [type === 'node' ? 'nodes' : 'edges', param[0].id.toString()],
            true,
            currentNode,
          ),
        ].reduce(json1.type.compose, null);
        break;
      default:
        break;
    }
    this.flow.submitOp(op, (error) => {
      if (error) {
        // console.log(error);
        this.flow.submitOp(op);
      }
    });
  }
}

export default FlowWebSocket;
