import Router from 'koa-router';
import users from './user-routes.js';
import swagger from './swagger-routes.js';

const router = new Router();
const api = new Router().use(users);

router.get('/', async (ctx) => {
    ctx.body = 'ok';
    ctx.status = 200;
    await ctx.session.save();
});

router.get('/api/hello-world', async (ctx) => {
  // console.log(ctx.session);
  ctx.session.hello = 'hi';
  await ctx.session.save();

  ctx.body = 'hello world!';
  ctx.status = 200;
  // console.log(ctx);

});
router.use('/swagger', swagger);
router.use('/api', api.routes());

export default router;
