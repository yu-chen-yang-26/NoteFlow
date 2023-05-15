import { Flows, FlowList } from '../../model/mongodb/model/index.js';

const getColabList = async (ctx) => {
  const { id } = ctx.query;
  if (!id) {
    ctx.throw(402, 'You did not offer sufficient data');
  }
  // 查看這個人是否擁有這個 Flow 的瀏覽權限
  const schema = new FlowList(ctx.session.email);
  await schema.fetchFlowList();

  let canEdit = false;
  let owner;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < schema.flowList.length; i++) {
    if (schema.flowList[i].flowId === id) {
      canEdit = true;
      owner = schema.flowList[i].owner;
      break;
    }
  }
  if (!canEdit) {
    ctx.throw(403, 'Forbidden. You are not invited into this flow.');
  }
  // 查看這個人
  const colabs = await Flows.fetchColaborators(owner, id);

  ctx.status = 200;
  ctx.body = JSON.stringify(colabs);
};

export default getColabList;
