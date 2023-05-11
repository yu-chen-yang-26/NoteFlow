import Flow from '../../database/mongodb/model/object/Flow.js';

const createFlow = async (ctx) => {
  if (!ctx.session.email) {
    ctx.throw(401, "Unauthorized. You haven't log in yet.");
  }

  const owner = ctx.session.email;
  const flowId = await Flow.generateFlowId(owner);
  const flow = new Flow(flowId, '', owner);

  await flow.newify();

  ctx.body = flowId;
  ctx.status = 200;
};

export default createFlow;
