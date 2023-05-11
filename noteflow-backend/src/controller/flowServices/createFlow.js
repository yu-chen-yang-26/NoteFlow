import Flow from '../../model/mongodb/model/object/Flow.js';

const createFlow = async (ctx) => {
    if (!ctx.session.email) {
        ctx.throw(401, "Unauthorized. You haven't log in yet.");
    }

    const owner = ctx.session.email;

    try {
        const flowId = await Flow.generateFlowId(owner);
        const flow = new Flow(flowId, '', owner);
        await flow.newify();
        ctx.body = flowId;
        ctx.status = 200;
    } catch (err) {
        // 在 Model 階段出現任何錯誤
        ctx.throw(404, JSON.stringify(err));
    }
};

export default createFlow;
