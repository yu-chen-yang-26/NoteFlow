import whoAmI from '../controller/userServices/whoAmI.js';

const logined = async (ctx, next) => {
  await whoAmI(ctx);
  return next();
};

export default logined;
