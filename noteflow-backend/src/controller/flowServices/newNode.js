import CODE from '../../lib/httpStatus.js';
import { NodeRepo } from '../../model/mongodb/model/index.js';

const newNode = async (ctx) => {
  const nodeRepo = new NodeRepo(ctx.session.email);

  try {
    const nodeId = await nodeRepo.newNode();

    ctx.body = { nodeId };
    ctx.status = CODE.success;
  } catch (err) {
    // 在 Model 階段出現任何錯誤
    ctx.throw(CODE.internal_error, JSON.stringify(err));
  }
};

export default newNode;
