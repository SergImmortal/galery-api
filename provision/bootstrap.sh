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

# Redis
echo "-= Start installing REDIS =-"
sudo mkdir /etc/redis
sudo mkdir /var/redis
sudo apt install -y redis-server
sudo apt install -y redis-tools
sudo cp /tmp/redis-conf/redis.conf /etc/redis/redis.conf
sudo chmod -R 777 /var/redis
sleep 1
systemctl stop redis-server
adduser --system --group --no-create-home redis
mkdir /var/lib/redis
chown redis:redis /var/lib/redis
chmod 770 /var/lib/redis
cp /tmp/redis-conf/redis.service /etc/systemd/system/redis.service
sudo echo -n > /etc/redis/redis.confe
echo "maxmemory 52mb" >> /etc/redis/redis.confe
echo "maxmemory-policy allkeys_lfu" >> /etc/redis/redis.confe
sudo systemctl start redis-server
sudo systemctl enable redis-server
sleep 1
if [[ "$( echo 'ping' | /usr/bin/redis-cli )" == "PONG" ]] ; then
    echo "ping worked"
else
    echo "ping FAILED"
fi
sudo systemctl status redis
sudo systemctl status redis-server
echo "-= REDIS installed =-"
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
