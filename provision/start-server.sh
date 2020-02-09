#!/bin/bash
sleep 1
cd /var/www/project

npm run build-ts

pm2 start dist/server.js --watch

sudo service mongod start

npm update --force --no-bin-links

npm run build-ts &
