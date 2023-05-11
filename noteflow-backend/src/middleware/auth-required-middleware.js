// import { AuthenticationError } from '../lib/errors.js';

export function auth(ctx, next) {
    // ctx.assert(ctx.state.user, new AuthenticationError())
    return next();
}
