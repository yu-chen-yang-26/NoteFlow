/* eslint-disable import/no-extraneous-dependencies */
import _ from 'lodash';
import db from '../../lib/db.js';

const verifyToken = async (ctx) => {
  try {
    const userId = ctx.params.id;
    const { token } = ctx.params;

    const user = await db('users').first().where({ id: userId });

    if (String(user.token).valueOf() === String(token).valueOf()) {
      await db('users')
        .where({ id: userId })
        .update({
          verified: true,
        })
        .returning('*');

      ctx.session = {
        logined: true,
        email: user.email,
        name: user.name,
        picture: user.picture,
      };
      await ctx.session.save();

      const newUser = await db('users').first().where({ id: userId });
      ctx.status = 200;
      ctx.body = { user: _.omit(newUser, ['password']) };
    }
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = JSON.stringify({ errors: err.message });
    ctx.throw(`${err.status}, Bad request. ${err.message}`);
  }
};

export default verifyToken;
