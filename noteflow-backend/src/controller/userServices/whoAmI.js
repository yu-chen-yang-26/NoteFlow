import db from '../../lib/db.js';

const whoAmI = async (ctx) => {
  if (!ctx.session.email || !ctx.session.logined) {
    ctx.throw(401, 'You have no login data.');
  }

  const result = await db('users').first().where({ email: ctx.session.email });

  const { email, logined, name } = ctx.session;

  ctx.body = JSON.stringify({ email, logined, name, picture: result.picture });
  ctx.status = 200;
};

export default whoAmI;
