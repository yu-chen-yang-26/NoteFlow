/* eslint-disable import/no-extraneous-dependencies */
import humps from 'humps';
import _ from 'lodash';
import argon2 from 'argon2';
import db from '../../lib/db.js';

const verifyToken = async (ctx) => {
    try {
        var userId = ctx.params.id;
        var token = ctx.params.token;

        const user = await db('users').first().where({ id: userId });

        if (String(user.token).valueOf() == String(token).valueOf()) {
            await db('users')
                .where({ id: userId })
                .update({
                    verified: true,
                })
                .returning('*')
                .then((rows) => {
                    console.log('User verified successfully.');
                });

            ctx.session.logined = true;
            ctx.session.email = user.email;
            ctx.session.name = user.name;
            ctx.session.picture = user.picture;
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
