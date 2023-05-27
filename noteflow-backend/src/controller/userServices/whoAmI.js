import path from 'path';
import fs from 'fs';
import db from '../../lib/db.js';
import CODE from '../../lib/httpStatus.js';

const whoAmI = async (ctx) => {
  const { email, logined, name } = ctx.session;

  let result;
  if (email) {
    result = await db('users').first().where({ email });
    if (result.picture) {
      if (
        !result.picture.startsWith('http') &&
        !fs.existsSync(path.join(process.cwd(), 'images', result.picture))
      ) {
        result.picture = null;
        db('users').insert({ picture: null }).where({ email });
      }
    }

    ctx.body = JSON.stringify({
      email,
      logined: !!logined,
      name,
      picture: result.picture,
    });
    ctx.status = CODE.success;
  }
};

export default whoAmI;
