#!/bin/bash

export NODE_ENV=development
export NOTEFLOW_BACKEND=backend
export PHOTO_FS=noteflow.live
export BACKEND_EXPOSE_PORT=3000
export FRONTEND_EXPOSE_PORT=7415
export MONGO_EXPRESS_EXPOSE_PORT=8082

export MONGO_HOST=mongo
export MONGO_DB=noteflow
export MONGO_INITDB_ROOT_USERNAME=root
export MONGO_INITDB_ROOT_PASSWORD=112a
export MONGO_NOTEFLOW_USERNAME=jounglab
export MONGO_NOTEFLOW_PASSWORD=112a
export MONGO_PORT=27017

export MONGO_EXPRESS_HOST=mongo-express
export MONGO_EXPRESS_USERNAME=jounglab112a
export MONGO_EXPRESS_PASSWORD=112a

export POSTGRES_HOST=postgres
export POSTGRES_DB=noteflow
export POSTGRES_USER=user
export POSTGRES_PASSWORD=112a
export POSTGRES_PORT=5432

export REDIS_HOST=redis
export REDIS_PORT=6379
export REDIS_SESSION_HOST=redis-session
export REDIS_SESSION_PORT=6379
export REDIS_ACCOUNT=default
export REDIS_PASSWORD=ntuim-sdm-6

export secret=secret

export S3_BUCKET_REGION=ap-northeast-1

export EMAIL_HOST=
export EMAIL_USER=
export EMAIL_PASSWORD=
export REFRESH_TOKEN=
export CLIENT_SECRET=
export CLIENT_ID=
