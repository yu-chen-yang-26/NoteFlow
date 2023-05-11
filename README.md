前後端開發
```bash
git clone frontend && backend...
## rename <source> <target>
## rename 的 source directory name 不管是什麼，都改成 target 就對了
cd frontend && yarn
cd backend && npm i
rename NoteFlowFrontend noteflow-frontend
rename noteflow-backend noteflow-backend

docker compose --env-file .compose.env up -d

## frontend will be open on 7415 by default.(https://localhost:7415)
## if you want to change port, feel free to change .compose.env
## where variable name is *-EXPOSE-PORT.

docker compose --env-file .compose.env down
```

開發完畢，build docker
```bash
./backend.build.sh      ## build backend
./frontend.build.sh     ## build frontend
```