import NodeRepo from '../../model/mongodb/model/object/NodeRepo.js';

const setTitle = async (ctx) => {
  const { id, title } = ctx.request.body;

  try {
    await NodeRepo.setTitle(id, title);
  } catch (e) {
    ctx.throw(500, 'Internal server error');
  }
  ctx.status = 200;
  ctx.body = JSON.stringify(title);
};

export default setTitle;
