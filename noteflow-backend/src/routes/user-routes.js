import Router from 'koa-router';
import { user, flow } from '../service/index.js';
import { auth } from '../middleware/auth-required-middleware.js';

const router = new Router();
router
  .post('/user/login', user.login)
  .post('/user/logout', user.logout)
  .post('/user/register', user.register)
  .get('/use/verify/:id/:token', user.verifyToken)
  .post('/user/google-login', user.googleLogin)
  .get('/user/who-am-i', user.whoAmI)
  .put('/user/update', auth, user.updateUserInfo)

  .get('/flows/', flow.getFlows)
  .post('/flows/create', flow.createFlow)
  // .get('/flows/access-flow, flow.accessFlow) // 是否可以進入這個 flow 修改 // 變成 middleware 做在 ws 裡面
  // .put('/flows/add-colab, flow.addColab)
  // .put('/flows/remove-colab, flow.removeColab)
  .get('/library', flow.getLibrary)
  // .put('/library/add-node, flow.addNodeToLibrary)
  // .put('/library/remove-node, flow.removeNodeFromLibrary')
  .post('/nodes/new-node', flow.newNode)
  // .get('/nodes/access-node, flow.accessNode) // 是否可以進入這個 node 修改 // 變成 middleware 做在 ws 裡面
  // .put('/nodes/add-colab, flow.addColab)
  // .put('/nodes/remove-colab, flow.removeColab);
  // .put('/nodes/add-ref, flow.addRef); // 可以選擇 90 天後 ref: 0 的時候要不要自動清除


// 我有改一些 route 的名字.

export default router.routes();
