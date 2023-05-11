/* eslint-disable import/no-extraneous-dependencies */
import humps from 'humps';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import argon2 from 'argon2';
import db from '../../lib/db.js';
import { createUserBucket } from '../../database/mongodb/model/index.js';
import sendEmail from '../../lib/email.js';
import { userSchema, tokenSchema } from '../../database/postgres/schemas/index.js';

const register = async (ctx) => {
    try {
        const { user } = ctx.request.body; // if none, assign user with {}

        const { error } = validate(user);
        if (error) return res.status(400).send(error.details[0].message);

        // if (!user) {
        //   ctx.throw(400, "Bad request. You didn't provide user column.");
        // }
        // if (!user.email || !user.name || !user.password) {
        //   ctx.throw(400, "Bad request. You didn't provide sufficient information.");
        // }

        // create User
        const result = await db('users').first().where({ email: user.email });
        if (result) {
            ctx.throw(401, 'Forbidden, you already have  an email.');
        }

        user = await new userSchema({
            name: req.body.name,
            email: req.body.email,
        }).save();

        let token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex'),
        }).save();

        const message = `${process.env.BASE_URL}/user/verify/${user.id}/${token.token}`;
        await sendEmail(user.email, 'Verify Email', message);

        res.send('An Email sent to your account please verify');
    } catch (error) {
        ctx.throw(400, 'An error occurred');
    }
};

export default register;
