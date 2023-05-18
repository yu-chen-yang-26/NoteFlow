import sharedb from 'sharedb/lib/client';
import * as json1 from 'ot-json1';
import ReconnectingWebsocket from 'reconnecting-websocket';
import { BASE_URL } from '../API/api';

sharedb.types.register(json1.type);

class FlowWebSocket {
  constructor(flowId, updateData, sendLocation, receiveLocation) {
    this.getConnection(flowId, updateData, sendLocation, receiveLocation);
    this.lastUpdated = Date.now();
    this.mouseList = [];
    // [{email: ..., name: ..., x: ..., y: ...}]
  }

  getConnection(flowId, updateData, sendLocation, receiveLocation) {
    // sharedb
    this.socket = new ReconnectingWebsocket(
      `wss://${BASE_URL}/ws/flow?id=${flowId}`,
    );

    const collection = 'flow-sharedb';
    const connection = new sharedb.Connection(this.socket);
    const flow = connection.get(collection, flowId);
    flow.subscribe((e) => {
      if (e) throw e;
      this.flow = flow;
      this.flow.on('op', (op) => {
        this.lastOp = op;
        updateData(this.convertFlowData(this.flow.data));
      });

      updateData(this.convertFlowData(this.flow.data));
    });

    // mouse
    // 這個會追蹤 mouse 並定期上傳其位置
    // this.mouseSocket = new ReconnectingWebsocket(
    //   `wss://${BASE_URL}/ws/flow-mouse?id=${nodeId}`,
    // );
    // this.mouseSocket.addEventListener('message', (msg) => {
    //   const message = JSON.parse(msg.data.toString('utf-8'));
    //   let userList = new Array(message.length);
    //   message.forEach((m, id) => {
    //     const newList = m.split('-');
    //     const singleUser = newList[newList.length - 1];
    //     userList[id] = singleUser;
    //   });
    //   updateData(userList);
    // });
  }

  close(callback) {
    this.socket.close();
    callback(1000);
  }

  addComponent(component, type) {
    const op = [
      json1.insertOp(
        [type === 'node' ? 'nodes' : 'edges', component.id],
        component,
      ),
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

        console.log(param[0].dragging);
        if (!param[0].dragging) {
          console.log('black');
          currentNode.style.border = '2px solid black';
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
        // if (param[0].selected) {
        //   currentNode.style.border = '2px solid orange';
        // }

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

  sendLocation(x, y) {
    this.mouseSocket.send(
      JSON.stringify({
        x,
        y,
      }),
    );
  }

  convertFlowData(flow) {
    const toReturn = JSON.parse(JSON.stringify(flow));
    toReturn.edges = Object.values(toReturn.edges);
    toReturn.nodes = Object.values(toReturn.nodes);
    return toReturn;
  }
}

export default FlowWebSocket;
