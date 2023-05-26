import path from 'path';
import fs from 'fs';
import db from '../../lib/db.js';
import CODE from '../../lib/httpStatus.js';

const whoAmI = async (ctx) => {
  const { email, logined, name } = ctx.session;

  let result;
  if (email) {
    result = await db('users').first().where({ email: ctx.session.email });
  }

  let { picture } = result;
  if (!fs.existsSync(path.join(process.cwd(), 'images', picture))) {
    console.log('不存在', picture);
    picture = null;
  }

  ctx.body = JSON.stringify({
    email,
    logined: !!logined,
    name,
    picture,
  });
  ctx.status = CODE.success;
};

export default whoAmI;
