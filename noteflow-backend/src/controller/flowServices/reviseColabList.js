import { FlowList, Flow } from '../../model/mongodb/model/index.js';

const reviseColabList = async (ctx) => {
  const { colabs, id } = ctx.request.body;
  if (!id || !colabs) {
    ctx.throw(402, 'You did not offer sufficient data');
  }
  // 查看這個人是否登入 ## TODO
  if (!ctx.session.email) {
    ctx.throw(401, "Unauthorized. You haven't log in yet.");
  }
  // 查看這個人是否擁有這個 Flow 的瀏覽權限
  const schema = new FlowList(ctx.session.email);
  await schema.fetchFlowList();

  let canEdit = false;
  // let owner;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < schema.flowList.length; i++) {
    if (schema.flowList[i].flowId === id) {
      canEdit = true;
      // owner = schema.flowList[i].owner;
      break;
    }
  }
  if (!canEdit) {
    ctx.throw(403, 'Forbidden. You are not invited into this flow.');
  }
  // 查看這個人
  // const colabs = await Flows.fetchColaborators(owner, id);
  const added = [];
  const removed = [];
  try {
    colabs.map(async (data) => {
      if (data.type === 'new') {
        added.push(data.email);
        await schema.addSomebodyToFlowList(data.email, id);
      } else if (data.type === 'remove') {
        removed.push(data.email);
        await schema.removeSomebodyFromFlowList(data.email, id);
      }
    });
    await Flow.refreshColabs(id, added, removed);
    // eslint-disable-next-line no-empty
  } catch (err) {
    ctx.throw(500, JSON.stringify(err));
  }

  ctx.status = 200;
};

export default reviseColabList;
