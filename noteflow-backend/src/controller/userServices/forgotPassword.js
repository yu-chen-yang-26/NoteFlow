import crypto from 'crypto-js';
import argon2 from 'argon2';
import db from '../../lib/db.js';
import sendEmail from '../../lib/email.js';
import HTML_TEMPLATE, { htmlHandler } from '../../lib/mail-template.js';
import redisClient from '../../model/redis/redisClient.js';
import CODE from '../../lib/httpStatus.js';

const { EMAIL_USER, EMAIL_HOST } = process.env;

const forgotPassword = async (ctx) => {
  const { email } = ctx.request.body;

  if (!email) {
    ctx.throw(CODE.insufficient, 'You did not provide sufficient data.');
  }

  const result = await db('users').first().where({ email });
  if (!result) {
    ctx.throw(CODE.not_found, 'This email does not exist.');
  }

  const randomString = Math.random().toString(15);
  const token = crypto.SHA256(randomString).toString(crypto.enc.Hex);

  const redirect = `${EMAIL_HOST}/resetPassword?token=${token}&email=${email}`;
  // api/user/reset-password-auth

  // try {
  sendEmail({
    subject: '[Noteflow] 現在重置你的密碼!',
    to: email,
    from: EMAIL_USER,
    html: htmlHandler(email, redirect),
  });

  await redisClient.set(`reset-password-${token}`, 1, 'EX', 86400);

  ctx.status = CODE.success;
  // ctx.body = return html 回去
  // } catch (e) {
  // ctx.throw(CODE.internal_error, 'Internal server error');
  // }
};

const forgotPasswordAuth = async (ctx) => {
  const { token, email } = ctx.request.body;
  const value = await redisClient.get(`reset-password-${token}`);

  ctx.assert(value, CODE.timeout, 'Request timeout.');

  ctx.session = {
    forgotPassword: true,
    email,
  };

  await ctx.session.save();
  ctx.status = CODE.success;
};

const forgotPasswordRenew = async (ctx) => {
  if (ctx.session.logined === true) {
    const { email } = ctx.session;
    const { oldPassword, newPassword } = ctx.request.body;

    const result = await db('users').first().where({ email });

    const validate = await argon2.verify(result.password, oldPassword);

    ctx.assert(validate, CODE.unauthorized, 'Old password is invalid.');

    const password = await argon2.hash(newPassword);
    await db('users').update({ password }).where({ email });
  } else {
    const { newPassword } = ctx.request.body;
    const { email } = ctx.session;

    ctx.assert(ctx.session.forgotPassword, CODE.timeout, 'Request timeout.');

    // TODO
    const password = await argon2.hash(newPassword);
    await db('users').update({ password }).where({ email });
  }

  ctx.status = CODE.success;
};

export { forgotPassword, forgotPasswordAuth, forgotPasswordRenew };
