/* eslint-disable import/no-extraneous-dependencies */
import _ from 'lodash';
import argon2 from 'argon2';
import { ValidationError } from 'yup';
import db from '../../lib/db.js';

const login = async (ctx) => {
  const { user } = ctx.request.body;
  ctx.assert(
    _.isObject(user) && user.email && user.password,
    422,
    new ValidationError(['malformed request'], '', 'email or password'),
  );

  const result = await db('users').first().where({ email: user.email });
  ctx.assert(
    result,
    401,
    new ValidationError(['is invalid'], '', 'email or password'),
  );

  ctx.assert(
    await argon2.verify(result.password, user.password),
    401,
    new ValidationError(['is invalid'], '', 'email or password'),
  );
  
  user.name = result.name;

  ctx.session.logined = true;
  ctx.session.email = user.email;
  ctx.session.name = user.name;
  ctx.session.picture = user.picture;
  await ctx.session.save(); 

  ctx.status = 200;
  ctx.body = JSON.stringify({ user: _.omit(user, ['password']) }); // 把 password 給挑掉
};

export default login;
