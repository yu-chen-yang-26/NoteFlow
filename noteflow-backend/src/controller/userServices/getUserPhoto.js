import fs from 'fs';
import path from 'path';

import db from '../../lib/db.js';
import CODE from '../../lib/httpStatus.js';

const getUserPhoto = async (ctx) => {
  let { email } = ctx.query;
  if (!email) {
    email = ctx.session.email;
  }
  try {
    const result = await db('users').first().where({ email });
    if (result.picture) {
      if (
        !result.picture.startsWith('http') &&
        !fs.existsSync(path.join(process.cwd(), 'images', result.picture))
      ) {
        result.picture = null;
        db('users').insert({ picture: null }).where({ email });
      }
    }

    ctx.status = CODE.success;
    ctx.body = result.picture;
  } catch (e) {
    ctx.throw(CODE.internal_error);
  }
};

export default getUserPhoto;
