docker build -t noteflow-frontend -f ./dockerfiles/frontend.dockerfile .
docker tag noteflow-frontend vnaticzhock/noteflow-frontend:latest
docker push vnaticzhock/noteflow-frontend:latest