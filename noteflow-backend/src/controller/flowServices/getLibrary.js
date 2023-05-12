import Library from '../../model/mongodb/model/object/Library.js';

const getLibrary = async (ctx) => {
  if (!ctx.session.email) {
    ctx.throw(401, "Unauthorized. You haven't log in yet.");
  }

  const library = new Library(ctx.session.email);
  try {
    await library.fetchNodes();
  } catch (err) {
    // 在 Model 階段出現任何錯誤
    ctx.status = 404;
    ctx.body = JSON.stringify(err);
    return;
  }

  // 轉換為物件，不要將一些無用的 Prototype 傳回去
  ctx.status = 200;
  ctx.body = JSON.stringify(library.nodes);
};

export default getLibrary;
