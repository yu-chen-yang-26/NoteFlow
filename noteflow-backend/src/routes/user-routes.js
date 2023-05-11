import Router from 'koa-router';
import { user, flow } from '../controller/index.js';
import { auth } from '../middleware/auth-required-middleware.js';
import redisClient from '../model/redis/redisClient.js';

const router = new Router();
router
    .get('hello-world', async (ctx) => {
        // console.log(ctx.session);
        ctx.session.hello = 'hi';
        await ctx.session.save();

        ctx.body = 'hello world!';
        ctx.status = 200;
        // console.log(ctx);
    })
    .get('/api/reset-redis', async (ctx) => {
        await redisClient.flushall();
        const keys = await redisClient.keys('*');
        ctx.status = 200;
    })
    .post('/user/login', user.login)
    .post('/user/logout', user.logout)
    .post('/user/register', user.register)
    .get('/user/verify/:id/:token', user.verifyToken)
    .post('/user/google-login', user.googleLogin)
    .get('/user/who-am-i', user.whoAmI)
    .post('/user/update', auth, user.updateUserInfo)

    .get('/flows', flow.getFlows)
    .post('/flows/create', flow.createFlow)
    // .get('/flows/access-flow, service.accessFlow) // 是否可以進入這個 flow 修改 // 變成 middleware 做在 ws 裡面
    // .put('/flows/add-colab, service.addColab)
    // .put('/flows/remove-colab, service.removeColab)
    .get('/library', flow.getLibrary)
    // .put('/library/add-node, service.addNodeToLibrary)
    // .put('/library/remove-node, service.removeNodeFromLibrary')
    .post('/nodes/new-node', flow.newNode);
// .get('/nodes/access-node, service.accessNode) // 是否可以進入這個 node 修改 // 變成 middleware 做在 ws 裡面
// .put('/nodes/add-colab, service.addColab)
// .put('/nodes/remove-colab, service.removeColab);
// .put('/nodes/add-ref, service.addRef); // 可以選擇 90 天後 ref: 0 的時候要不要自動清除

// 我有改一些 route 的名字.

export default router.routes();
