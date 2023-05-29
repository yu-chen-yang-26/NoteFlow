import fs from 'fs';
import path from 'path';

import db from '../../lib/db.js';
import CODE from '../../lib/httpStatus.js';

const getUserPhoto = async (ctx) => {
  let { email } = ctx.query;
  if (!email) {
    email = ctx.session.email;
  }
<<<<<<< HEAD
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
=======
>>>>>>> dc9ba0462887d76f20f8c9f7219d74c3f4be56f5

  let result;
  try {
    result = await db('users').first().where({ email });
  } catch (e) {}

  ctx.status = CODE.success;
  ctx.body = JSON.stringify(result ? result.picture : null);
  ctx.set('Content-Type', 'application/json')
  
};

export default getUserPhoto;
