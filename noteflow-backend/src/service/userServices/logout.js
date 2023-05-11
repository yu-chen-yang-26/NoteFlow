const logout = async (ctx) => {
  ctx.session = null;
  await ctx.session.save();
  ctx.status = 200;
  ctx.body = 'Log out successfully!';
};

export default logout;
