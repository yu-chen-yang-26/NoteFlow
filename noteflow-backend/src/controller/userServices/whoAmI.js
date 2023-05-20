import db from '../../lib/db.js';
import CODE from '../../lib/httpStatus.js';

const whoAmI = async (ctx) => {
  const { email, logined, name } = ctx.session;

  let result;
  if (email) {
    result = await db('users').first().where({ email: ctx.session.email });
  }

  ctx.body = JSON.stringify({
    email,
    logined: !!logined,
    name,
    picture: result ? result.picture : null,
  });
  ctx.status = CODE.success;
};

export default whoAmI;
