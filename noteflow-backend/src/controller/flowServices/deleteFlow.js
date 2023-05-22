import CODE from '../../lib/httpStatus.js';
import { Flows } from '../../model/mongodb/model/index.js';

const deleteFlow = async (ctx) => {
  const { id } = ctx.request.body;

  ctx.assert(
    id.split('-')[0] === ctx.session.email,
    CODE.unauthorized,
    'You are not the owner of the flow.',
  );

  try {
    await Flows.deleteFlow(id);
    ctx.body = id;
    ctx.status = CODE.success;
  } catch (err) {
    // 在 Model 階段出現任何錯誤
    ctx.throw(CODE.internal_error, JSON.stringify(err));
  }
};

export default deleteFlow;
