#!/bin/bash

if ! systemctl is-active --quiet docker;
then
  echo "----------Docker is not started, Starting Docker----------"
  sudo systemctl start docker
else
  echo "----------Docker is already started---------------------"
fi

if ! systemctl is-enabled --quiet docker;
then
  echo "----------Activating Docker--------------"
  sudo systemctl enable docker
else
  echo "----------Docker is already launched--------------------"
fi

if [ "$(sudo docker ps -aq)" ];
then
  echo "----------Deleting stopped containers-------------------"
  sudo docker container prune -f
else
  echo "----------No container to delete------------------------"
fi

echo "----------Stopping existing containers---------------------"
sudo docker compose down

echo "----------Building Docker images and starting containers---------------------"
sudo docker compose up --build
