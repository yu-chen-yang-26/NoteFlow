FROM --platform=linux/amd64 node:20.2 as builder
COPY ./noteflow-frontend /frontend
WORKDIR /frontend
RUN rm -r node_modules
RUN yarn && yarn build

## backend

FROM --platform=linux/amd64 node:20.2

COPY ./noteflow-backend /backend
WORKDIR /backend
COPY --from=builder /frontend/dist /backend/dist
RUN rm -r node_modules
RUN npm install

EXPOSE 3000
