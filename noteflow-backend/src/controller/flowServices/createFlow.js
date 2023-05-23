import { Flow } from '../../model/mongodb/model/index.js';
import CODE from '../../lib/httpStatus.js';

const createFlow = async (ctx) => {
  const owner = ctx.session.email;

  try {
    const flowId = await Flow.generateFlowId(owner);
    const flow = new Flow(flowId, '', owner);
    await flow.newify();
    ctx.body = flowId;
    ctx.status = CODE.success;
  } catch (err) {
    // 在 Model 階段出現任何錯誤
    ctx.throw(CODE.internal_error, JSON.stringify(err));
  }
};

export default createFlow;
