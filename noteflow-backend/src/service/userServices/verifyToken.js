/* eslint-disable import/no-extraneous-dependencies */
import humps from 'humps';
import _ from 'lodash';
import argon2 from 'argon2';
import db from '../../lib/db.js';

const verifyToken = async (ctx) => {

  // user.uuid = uuidv4();
    // user.password = await argon2.hash(user.password);

    // await db('users').insert(humps.decamelizeKeys(user));

    // ctx.session.logined = true;
    // ctx.session.email = user.email;
    // ctx.session.name = user.name;
    // ctx.session.picture = user.picture;
    // await ctx.session.save();
    // await createUserBucket(user.email);

    // ctx.status = 200;
    // ctx.body = { user: _.omit(user, ['password']) };
};

export default verifyToken;
