import CODE from '../../lib/httpStatus.js';
import Library from '../../model/mongodb/model/object/Library.js';

const getLibrary = async (ctx) => {
  try {
    const nodes = await Library.fetchNodes(ctx.session.email);
    ctx.status = CODE.success;
    ctx.body = JSON.stringify(nodes);
  } catch (err) {
    // 在 Model 階段出現任何錯誤
    ctx.status = CODE.internal_error;
    ctx.body = JSON.stringify(err);
  }
};

export default getLibrary;
