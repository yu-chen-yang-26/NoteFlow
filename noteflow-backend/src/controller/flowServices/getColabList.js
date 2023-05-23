import CODE from '../../lib/httpStatus.js';

const getColabList = async (ctx) => {
  const { id } = ctx.query;
  if (!id) {
    ctx.throw(CODE.insufficient, 'You did not offer sufficient data');
  }
  // 在 middleware 已經 get 好
  ctx.body = JSON.stringify(ctx.colabs);
  ctx.status = CODE.success;
};

export default getColabList;
