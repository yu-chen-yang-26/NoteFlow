FROM node:lts
COPY ./noteflow-backend /backend
WORKDIR /backend
RUN npm install
EXPOSE 3000

CMD ["npm", "run", "start"]