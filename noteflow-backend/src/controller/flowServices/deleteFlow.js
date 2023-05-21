import CODE from '../../lib/httpStatus.js';
import { Flow } from '../../model/mongodb/model/index.js';

const deleteFlow = async (ctx) => {
  const { flowId } = ctx.request.body;

  ctx.assert(
    flowId.split('-')[0] === ctx.session.email,
    CODE.unauthorized,
    'You are not the owner of the flow.',
  );

  try {
    await Flow.deleteFlow(flowId);
    ctx.body = flowId;
    ctx.status = CODE.success;
  } catch (err) {
    // 在 Model 階段出現任何錯誤
    ctx.throw(CODE.internal_error, JSON.stringify(err));
  }
};

export default deleteFlow;
