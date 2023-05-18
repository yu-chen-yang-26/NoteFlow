// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import db from '../../lib/db.js';
import fs from 'fs';
import path from 'path';

const { PHOTO_FS } = process.env;

const instance = axios.create({
  baseURL: `http://${PHOTO_FS}`,
});

const BASE_PATH = path.join(process.cwd(), 'images');

console.log('photo fs', PHOTO_FS);

const setUserPhoto = async (ctx) => {
  const { image } = ctx.request.files;
  const { email } = ctx.session;

  const by = image[0].mimetype.split('/')[1];
  const filename = `${email}-${Date.now()}.${by}`;

  fs.writeFileSync(path.join(BASE_PATH, filename), image[0].buffer, {});

  await db('users').update({ picture: filename }).where({ email });

  ctx.status = 200;
  ctx.body = filename;
};

export default setUserPhoto;
