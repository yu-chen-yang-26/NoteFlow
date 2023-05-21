import CODE from '../../lib/httpStatus.js';
import FlowList from '../../model/mongodb/model/object/FlowList.js';
import Flows from '../../model/mongodb/model/object/Flows.js';

const getFlows = async (ctx) => {
  // 拿取你帳號裡面的所有 Flows
  const { page } = ctx.request.query;
  const flows = new FlowList(ctx.session.email);
  try {
    await flows.fetchFlowList();
    const result = await Flows.fetchFlowsByFlowList(flows.flowList, page);

    ctx.status = CODE.success;
    ctx.body = JSON.stringify(result);
  } catch (err) {
    // 在 Model 階段出現任何錯誤

    ctx.throw(CODE.internal_error, JSON.stringify(err));
  }
};

export default getFlows;
