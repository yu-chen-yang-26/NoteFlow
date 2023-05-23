import CODE from '../../lib/httpStatus.js';
import Library from '../../model/mongodb/model/object/Library.js';

const isFavorite = async (ctx) => {
  const { id } = ctx.query;
  if (!id) {
    ctx.throw(CODE.insufficient);
  }

  try {
    const isFav = await Library.isFavorite(ctx.session.email, id);
    ctx.status = CODE.success;
    ctx.body = JSON.stringify(isFav);
  } catch {
    ctx.throw(CODE.internal_error);
  }
};

export default isFavorite;
