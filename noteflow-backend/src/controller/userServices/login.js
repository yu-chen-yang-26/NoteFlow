/* eslint-disable import/no-extraneous-dependencies */
import _ from 'lodash';
import argon2 from 'argon2';
import db from '../../lib/db.js';
import CODE from '../../lib/httpStatus.js';

const login = async (ctx) => {
  try {
    const { user } = ctx.request.body;

    ctx.assert(
      _.isObject(user) && user.email && user.password,
      CODE.insufficient,
      JSON.stringify({ errors: 'email or password input error' }),
    );

    const result = await db('users').first().where({ email: user.email });
    ctx.assert(
      result,
      CODE.not_found,
      JSON.stringify({ errors: 'email is invalid' }),
    );

    const validate = await argon2.verify(result.password, user.password);

    ctx.assert(
      validate,
      CODE.unauthorized,
      JSON.stringify({ errors: 'password is invalid' }),
    );

    user.name = result.name;

    ctx.session = {
      logined: true,
      email: user.email,
      name: user.name,
      picture: user.picture,
    };
    await ctx.session.save();

    ctx.status = CODE.success;
    ctx.body = JSON.stringify({ user: _.omit(user, ['password']) });
  } catch (err) {
    ctx.status = err.status || CODE.internal_error;
    ctx.body = JSON.stringify(err);
  }
};

export default login;
