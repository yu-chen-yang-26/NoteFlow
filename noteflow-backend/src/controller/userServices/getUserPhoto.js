import db from '../../lib/db.js';

const getUserPhoto = async (ctx) => {
  let { email } = ctx.query;
  if (!email) {
    email = ctx.session.email;
  }

  const result = await db('users').first().where({ email });

  ctx.status = 200;
  ctx.body = result.picture;
};

export default getUserPhoto;
