export VITE_DEV=1
docker build -t noteflow-backend -f ./dockerfiles/bind.dockerfile .
docker tag noteflow-backend jounglab112a/noteflow-backend:final
docker push jounglab112a/noteflow-backend:final