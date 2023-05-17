import NodeRepo from '../../model/mongodb/model/object/NodeRepo.js';

const getTitle = async (ctx) => {
  const { id } = ctx.query;

  let resolved;
  try {
    resolved = await NodeRepo.getTitle(id);
  } catch (e) {
    ctx.throw(500, 'Internal server error');
  }

  ctx.status = 200;
  ctx.body = JSON.stringify(resolved);
};

export default getTitle;
