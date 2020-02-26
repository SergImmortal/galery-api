#!/bin/bash

timezone=$1
dbUser=$2
dbPwd=$3

echo "-= Start build =-";
# OS config
sudo timedatectl set-timezone $timezone
echo "-= Timezone seted =-";
sudo apt-get -y update
sudo apt-get -y upgrade
sudo apt-get -y install curl
sudo apt-get -y install git
sudo apt-get -y install wget
sudo apt-get -y install iptables
sudo apt-get -y install debconf-utils
sudo apt-get -y install zip
sudo apt-get -y install unzip
sudo apt-get -y install software-properties-common
echo "-= OS updated =-";

# Nginx install
sudo apt-get -y install nginx
sudo service nginx start
echo "-= Nginx installed =-"

# Nginx setup
sudo cp /home/vagrant/project/provision/nginx.conf /etc/nginx/sites-available/site.conf
sudo chmod 644 /etc/nginx/sites-available/site.conf
sudo ln -s /etc/nginx/sites-available/site.conf /etc/nginx/sites-enabled/site.conf
sudo service nginx restart
echo "-= Nginx configurated =-"

# Copy project files 
sudo rm -Rf /var/www
echo "-= Folder /var/www cleaned =-"

sudo ln -s /home/vagrant /var/www
echo "-= Symlink for /var/www => /home/vagrant created =-"

#POSTGRESQL
echo "-= Installing psql =-";

sudo apt-get install -y postgresql postgresql-contrib

echo "-= get version psql =-"
ver="$(sudo psql --version)"
ver_number="$(echo $ver | cut -d' ' -f3)"
ver_major="$(echo $ver_number | cut -d'.' -f1)"
ver_minor="$(echo $ver_number | cut -d'.' -f2)"

pconf_path=""
pconf_path_m="$(echo /etc/postgresql/$ver_major/main/postgresql.conf)"
pconf_path_mm="$(echo /etc/postgresql/$ver_major.$ver_minor/main/postgresql.conf)"

if [ -f $pconf_path_m ]; then
	ver=$ver_major
	pconf_path=$pconf_path_m
else
	ver=$ver_major.$ver_minor
	pconf_path=$pconf_path_mm
fi

echo "-= fix permission, fixing listen_addresses on postgresql.conf =-"
sudo sed -i "s/#listen_address.*/listen_addresses '*'/" $pconf_path

echo "-= fixing postgres pg_hba.conf file, replace the ipv4 host line with the bottom line =-"
var="cat >> /etc/postgresql/$ver/main/pg_hba.conf <<EOF
# Accept all IPv4 connections - FOR DEVELOPMENT ONLY!!!
host    all         all         0.0.0.0/0             md5
EOF"
echo $var
sudo bash -c "$var"

echo "-= create role(super user) vagrant:vagrant =-"
sudo su postgres -c "psql -c \"CREATE ROLE vagrant SUPERUSER LOGIN PASSWORD 'vagrant'\" "
sudo su postgres -c "createdb -E UTF8 -T template0 --locale=en_US.utf8 -O vagrant vagrant"

echo "-= psql restart =-"
sudo /etc/init.d/postgresql restart

#  Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod stop
sudo sed -i 's/bindIp\: 127\.0\.0\.1/bindIp\: 0\.0\.0\.0/' /etc/mongod.conf
cat <<EOT >> /etc/mongod.conf
security:
  authorization: "enabled"
EOT
sudo service mongod start
sleep 10
# Create MongoDB user
echo "-= Create db user =-";
mongo admin --eval "db.createUser({ user: '$dbUser', pwd: '$dbPwd', roles: [{role: 'root', db: 'admin'}]});"
echo "-= Created db user =-";
echo "-= MongoDB installed =-"

# Node JS install
# Node JS cleanup
sudo apt remove --purge nodejs npm
sudo apt clean
sudo apt autoclean
sudo apt install -f
sudo apt autoremove

curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo npm install -g pm2
sudo apt install node-typescript

echo " VERSIONS: "
echo "Node JS:"
sudo node -v
echo "npm:"
sudo npm -v
echo "-= Node JS installed =-"
cd /var/www/project
rm -r node_modules
sudo npm cache clear --force
sudo npm install --no-bin-links
npm list --depth 0
echo "-= DONE =-";
