import CODE from '../../lib/httpStatus.js';
import { NodeRepo } from '../../model/mongodb/model/index.js';

const getNodeTitle = async (ctx) => {
  const { id } = ctx.query;

  let resolved;
  try {
    resolved = await NodeRepo.getTitle(id);
    ctx.status = CODE.success;
    ctx.body = JSON.stringify(resolved);
  } catch (e) {
    ctx.throw(CODE.internal_error, 'Internal server error');
  }
};

export default getNodeTitle;
