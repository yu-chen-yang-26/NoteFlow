import { FlowList, Flow } from '../../model/mongodb/model/index.js';
import db from '../../lib/db.js';

const reviseColabList = async (ctx) => {
  const { colabs, id } = ctx.request.body;
  if (!id || !colabs) {
    ctx.throw(402, 'You did not offer sufficient data');
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
    colabs.map(async (data, index) => {
      if (data.type === 'new') {
        // 應該要先確認有沒有這一個人
        const result = await db('users').first().where({ email: data.email });
        if (result) {
          // 真的有這個人
          colabs[index].status = 200;
          added.push(data.email);
          await schema.addSomebodyToFlowList(data.email, id);
        } else {
          // 沒有這個人
          colabs[index].status = 404;
        }
      } else if (data.type === 'remove') {
        if (data.email === id.split('-')[0]) {
          // 如果是本人的 Flow
          colabs[index].status = 400;
        } else {
          const result = await db('users').first().where({ email: data.email });
          if (result) {
            // 真的有這個人
            colabs[index].status = 200;
            removed.push(data.email);
            await schema.removeSomebodyFromFlowList(data.email, id);
          } else {
            // 沒有這個人
            colabs[index].status = 404;
          }
        }
      }
    });
    await Flow.refreshColabs(id, added, removed);
    // eslint-disable-next-line no-empty
  } catch (err) {
    ctx.throw(500, JSON.stringify(err));
  }

  ctx.status = 200;
  ctx.body = JSON.stringify(colabs);
};

//

export default reviseColabList;
