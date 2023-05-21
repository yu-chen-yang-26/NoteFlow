import CODE from '../../lib/httpStatus.js';

const logout = async (ctx) => {
  ctx.session = null;
  ctx.status = CODE.success;
};

export default logout;
