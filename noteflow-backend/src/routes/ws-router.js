import { getSession } from '../model/redis/redisSession.js';
import { Flow, Node } from '../model/mongodb/model/index.js';

class WsRouter {
  constructor() {
    this.paths = [];
  }

  session(path, section, callback) {
    const exec = async (ws, req) => {
      const { email } = await getSession(req.headers.cookie);
      const params = new URLSearchParams(req.url.split('?')[1]);
      let Mode;
      switch (section) {
        case 'Node':
          Mode = Node;
          break;
        case 'Flow':
          Mode = Flow;
          break;
        default:
          break;
      }

      if (!Mode) return;
      const can = await Mode.CanUserEdit(
        params.get('id'),
        params.get('id').split('-')[0],
        email,
      );
      if (!can) {
        ws.close(1000);
      }

      callback(ws);
    };

    this.paths.push({
      path,
      exec,
    });
    return this;
  }

  no_session(path, callback) {
    const exec = (ws) => {
      callback(ws);
    };

    this.paths.push({
      path,
      exec,
    });
    return this;
  }

  serve(ws, req) {
    const urlList = req.url.split('?')[0].split('/');
    const url = `/${urlList[urlList.length - 1]}`;
    for (let i = 0; i < this.paths.length; i += 1) {
      if (url === this.paths[i].path) {
        this.paths[i].exec(ws, req);
      }
    }
  }
}

export default WsRouter;
