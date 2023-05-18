// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import db from '../../lib/db.js';

const { PHOTO_FS } = process.env;

const instance = axios.create({
  url: `http://${PHOTO_FS}`,
});

const setUserPhoto = async (ctx) => {
  const { photo } = ctx.request.body;
  const { email } = ctx.session;

  const formData = new FormData();
  formData.append('photo', photo, 'photo.jpg');
  formData.append('email', email);

  const res = await instance.post('/fs/new-photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (res.status !== 200) {
    ctx.throw(418, 'Photo not accepted.');
  }

  const path = JSON.parse(res.data); // path that the photo can be found.

  await db('users').update({ picture: path }).where({ email });

  ctx.status = 200;
  ctx.body = res.data;
};

export default setUserPhoto;
