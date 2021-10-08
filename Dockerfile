

# CMD To build image:
#     sudo docker build --tag avat:latest .

# CMD To create new container:
#     sudo docker run -it --rm -v ${PWD}:/avat -v /AVAT/node_modules -e CHOKIDAR_USEPOLLING=true --name avat -p 3001:3000 avat

# CMD To start/restart container:
#     sudo docker start avat

# CMD to stop:
#     sudo docker stop avat

# CMD Display containers:
#     sudo docker ps

# To Access website being sevred on port 8000 on machine:
#     http://127.0.0.1:8000

# Easy command list:
#     1) To build and run docker container
#       sudo docker build --tag avat:latest . && sudo docker run -it --rm -v ${PWD}:/avat -v /AVAT/node_modules -e CHOKIDAR_USEPOLLING=true --name avat -p 3001:3000 avat && sudo docker start avat && sudo docker ps -a | grep avat
#     2) To stop and remove container
#       sudo docker stop avat && sudo docker rm avat
#     3) To remove pre-existing container and build new container
#       sudo docker stop avat && sudo docker rm avat && sudo docker build --tag avat:latest . && sudo docker run -it --rm -v ${PWD}:/avat -v /AVAT/node_modules -e CHOKIDAR_USEPOLLING=true --name avat -p 3001:3000 avat && sudo docker start avat && sudo docker ps -a | grep avat


FROM node:16.10-alpine3.11

WORKDIR /AVAT

ENV PATH /AVAT/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

COPY . ./

CMD ["npm", "start"]