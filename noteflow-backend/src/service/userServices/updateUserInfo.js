/* eslint-disable import/no-extraneous-dependencies */
import humps from 'humps';
import _ from 'lodash';
import argon2 from 'argon2';
import db from '../../lib/db.js';

const updateUserInfo = async (ctx) => {
  const { body } = ctx.request;
  const { user: fields = {} } = body;
  const opts = { abortEarly: false, context: { validatePassword: false } };

  if (fields.password) {
    opts.context.validatePassword = true;
  }

  let user = { ...ctx.state.user, ...fields };
  user = await ctx.app.schemas.user.validate(user, opts);

  if (fields.password) {
    user.password = await argon2.hash(user.password);
  }

  user.updatedAt = new Date().toISOString();

  await db('users').where({ id: user.id }).update(humps.decamelizeKeys(user));

  ctx.logined = true;
  ctx.session.account = user.email;
  ctx.body = { user: _.omit(user, ['password']) };
  ctx.status = 200;
};

export default updateUserInfo;
