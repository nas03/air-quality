#!/bin/bash
# Stop all containers
docker stop `docker ps -qa`

# Remove all containers
docker rm `docker ps -qa`

# Remove all images
docker rmi -f `docker images -qa `

# Remove all networks
docker network rm `docker network ls -q`

#remove old artifact
rm -rf ~/airq-server.tar.gz

# Pull new artifact from S3
aws s3 cp s3://uet-airq/airq-server.tar.gz .

#Load new image
docker load < airq-server.tar.gz 

#Run new image
docker run -d -p 5500:5500 airq-server