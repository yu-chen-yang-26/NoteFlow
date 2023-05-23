import CODE from '../../lib/httpStatus.js';
import { NodeRepo } from '../../model/mongodb/model/index.js';

const setNodeTitle = async (ctx) => {
  const { id, title } = ctx.request.body;

  try {
    const result = await NodeRepo.setTitle(id, title);

    ctx.status = CODE.success;
    ctx.body = JSON.stringify(result);
  } catch (e) {
    ctx.throw(CODE.internal_error, 'Internal server error');
  }
};

export default setNodeTitle;
