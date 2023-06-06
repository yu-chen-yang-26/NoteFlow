# NoteFlow

## Configure Nginx in MacOS

因前後端溝通需要遵守同源政策，所以需要請老師遵照以下指示安裝 Nginx 並修改 configuration 檔。
以下指示為 Mac 系統的安裝方式。

```bash
## install nginx using brew, in Linux, try using apt-get install.
brew install nginx

## try default nginx to see whether it works.
nginx

## move our server config into nginx configuration directory.
mkdir /opt/homebrew/etc/nginx/servers
sudo mv ./template/noteflow.nginx.conf /opt/homebrew/etc/nginx/servers/noteflow.conf
## furthermore, you need to edit noteflow.conf where it is left unfilled.
## e.g. <cert_file> & <key_file>. you can fill the path of cert & key in frontend folder.

## make nginx test to see whether the new conf is valid
nginx -t

## if it is valid, kill original nginx and open new one.
lsof -i :8080
kill <pid>
nginx
```

## 啟動及關閉

用「docker compose --env-file .env.local up -d」啟動 docker 之後，瀏覽器輸入 localhost 即可使用 NoteFlow 網站。使用完畢通過「docker compose --env-file .env.local down」關閉 docker

```bash
docker compose --env-file .env.local up -d

docker compose --env-file .env.local down
```
## 其他說明

1. 本地版本沒有 SSO，如果需要測試 SSO 請使用線上版本
2. .env.local 以及 k8s_deployment 資料夾中的 k8s_env.sh 需要填上對應的值，這部分已在 email 中附給老師

## 線上版本

可以直接連「noteflow.live」使用線上版本
