## Dependencies
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- [Vagrant](https://www.vagrantup.com/downloads.html)
## Local enviroment setup:
add to file by path c:\windows\system32\drivers\etc\hosts
row with data from file config.yaml
````
ip hostname
````
example:
````
127.0.0.1 me.dev
````

Create config file ``config.yaml`` in root of project with next variables:
````
---
  name: (VM name)
  hostname: (local ostname)
  path: (path to project)
  virtualbox:
    memory: (max RAM volume for VM - default 2048)
  ip: (local ip for vagrant listen)
  timezone: (server timezone)
  appPort: 8085
  db:
    user: (db user login)
    password: (db useer password)
    name: (db name)
````

## Description
- OS :
	- Ubuntu 18.04 LTS x64
- DB :
	- MongoDB
- Server (proxy) :
	- Nginx
- Tool :
	- Node.js (app server)
  - NPM
  - PM2
  - TypeScript
  - Express JS
  - Mongoose

## Comand line interface for vagrant
````
- vagrant ssh (logout : CTRL+D)
- vagrant up --provider=virtualbox (start)
- vagrant reload
- vagrant reload --provision
- vagrant halt (stop)
- vagrant suspend
- vagrant destroy (delete VM)
````
- Path to project in local VM
```
cd /var/www/project
```

- Run tsc auto compilation
````
vagrant ssh
npm run watch-ts -prefix /var/www/project
````

- Nginx Log
````
- access_log /var/log/nginx/access.log
- error_log /var/log/nginx/error.log
````