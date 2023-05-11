前後端開發
```bash

docker compose --env-file .compose.env up -d

## frontend will be open on 7415 by default.
## but for same origin policy, you must not specify port when you want to access noteflow.
## you need to install and configure nginx for non-port support.
## (as a result, typing "localhost" into browser is sufficient to enter into noteflow.)
## if you want to change port, feel free to change .compose.env
## where variable name is *-EXPOSE-PORT.
## but you should edit the port at nginx.conf either.

docker compose --env-file .compose.env down
```

開發完畢，build docker
```bash
./backend.build.sh      ## build backend
./frontend.build.sh     ## build frontend
```
