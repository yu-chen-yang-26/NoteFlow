import { NodeRepo } from "../../database/mongodb/model/index.js"

const newNode = async (ctx) => {
  if (!ctx.session.email) {
    ctx.throw(401, "Unauthorized. You haven't log in yet.");
  }

  const nodeRepo = new NodeRepo(ctx.session.email);
  const nodeId = await nodeRepo.newNode();

  ctx.body = {nodeId: nodeId};
  ctx.status = 200;
}

export default newNode;
