FROM node:lts
COPY ./noteflow-frontend /frontend
WORKDIR /frontend
RUN yarn
EXPOSE 7414

CMD ["yarn", "vite"]