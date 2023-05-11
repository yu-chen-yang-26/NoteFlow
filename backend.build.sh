docker build -t noteflow-backend -f ./dockerfiles/backend.dockerfile .
docker tag noteflow-backend vnaticzhock/noteflow-backend:latest
docker push vnaticzhock/noteflow-backend:latest