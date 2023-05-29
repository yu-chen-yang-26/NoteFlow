import CODE from '../../lib/httpStatus.js';
import { NodeRepo } from '../../model/mongodb/model/index.js';

const newNode = async (ctx) => {
  const nodeRepo = new NodeRepo(ctx.session.email);

  let nodeId;
  try {
    nodeId = await nodeRepo.newNode();
  } catch (e) {}
  
  ctx.body = JSON.stringify(nodeId);
  ctx.status = nodeId ? CODE.success : CODE.internal_error;
 
};

export default newNode;
