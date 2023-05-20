import { Flows } from '../../model/mongodb/model/index.js';
import CODE from '../../lib/httpStatus.js';

const setFlowTitle = async (ctx) => {
  const { id, title } = ctx.request.body;

  try {
    const result = await Flows.setTitle(id, title);

    ctx.status = CODE.success;
    ctx.body = JSON.stringify(result);
  } catch (e) {
    ctx.throw(CODE.internal_error, 'Internal server error');
  }
};

export default setFlowTitle;
