import { NodeRepo } from '../../model/mongodb/model/index.js';

const newNode = async (ctx) => {
    if (!ctx.session.email) {
        ctx.throw(401, "Unauthorized. You haven't log in yet.");
    }

    const nodeRepo = new NodeRepo(ctx.session.email);

    try {
        const nodeId = await nodeRepo.newNode();

        ctx.body = { nodeId };
        ctx.status = 200;
    } catch (err) {
        // 在 Model 階段出現任何錯誤
        ctx.throw(404, JSON.stringify(err));
    }
};

export default newNode;
