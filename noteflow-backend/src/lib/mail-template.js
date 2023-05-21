/* eslint-disable import/no-extraneous-dependencies */
// an email template that can be used with Nodemailer to send emails
import fs from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';

const htmlHandler = (email, redirect) => {
  const html = fs
    .readFileSync(
      path.join(process.cwd(), 'src', 'lib', 'forgot-password', 'index.html'),
    )
    .toString();
  const { document } = new JSDOM(html).window;
  document.querySelector('#greetings').textContent = `${email} 您好`;
  document.querySelector('a').href = redirect;

  const modified = document.documentElement.outerHTML;

  return modified;
};

const HTML_TEMPLATE = (redirect) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>NoteFlow</title>
        <style>
          .container {
            width: 100%;
            height: 100%;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .email {
            width: 80%;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
          }
          .email-header {
            background-color: #333;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
          .email-body {
            padding: 20px;
          }
          .email-footer {
            background-color: #333;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email">
            <div class="email-header">
              <h1>NoteFlow</h1>
            </div>
            <div class="email-body">
              <a href="${redirect}">verify account</a>
            </div>
            <div class="email-footer">
              <p>SDM group-6</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

export default HTML_TEMPLATE;
export { htmlHandler };
