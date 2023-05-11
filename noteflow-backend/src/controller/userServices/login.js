/* eslint-disable import/no-extraneous-dependencies */
import _ from 'lodash';
import argon2 from 'argon2';
import { ValidationError } from 'yup';
import db from '../../lib/db.js';

const login = async (ctx) => {
    try {
        const { user } = ctx.request.body;

        ctx.assert(
            _.isObject(user) && user.email && user.password,
            422,
            JSON.stringify({ errors: 'email or password input error' })
        );

        const result = await db('users').first().where({ email: user.email });
        ctx.assert(result, 401, JSON.stringify({ errors: 'email is invalid' }));

        var validate = await argon2.verify(result.password, user.password);

        ctx.assert(
            validate,
            401,
            JSON.stringify({ errors: 'password is invalid' })
        );

        user.name = result.name;

        ctx.session = {
            logined: true,
            email: user.email,
            name: user.name,
            picture: user.picture,
        };
        await ctx.session.save();

        ctx.status = 200;
        ctx.body = JSON.stringify({ user: _.omit(user, ['password']) });
        console.log(ctx.body);
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = JSON.stringify(err);
    }
};

export default login;
