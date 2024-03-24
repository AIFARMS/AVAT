# AVAT

The front-end dashboard that provides the ability to annotate videos of livestock for the use in research.

## Goals
The goal of this project is to create a tool that is easy to use, has a small learning curve and can scale easily to provide the ability to annotate videos efficiently and at scale. The intuition of this project is gained from analyzing similar projects and analyzing the weaknesses and points of frustration and improving them. Another goal is to have an annotation workflow that is extremely fast and efficient, as there are terabytes of video that needs to be processed at large. 

## USAGE
Please refer to [USAGE.md](https://github.com/AIFARMS/AVAT/blob/master/README.md) for a detailed guide on how to use the tool.

## Local Deployment (Frontend)

These instructions will get you a copy of the project up and running on your local machine for viewing. 

### Prerequisites:

You will need to have npm, firefox/chrome and git installed on your system for this to work. 

### Installing and Building:

First, you will need to clone the repository to your desired location

```
git clone https://github.com/AIFARMS/pig-annotation-tool
```

Secondly, you will need to install the node_modules which can be done by:
```
npm install
```
Lastly, run start to get the project running on your local machine. The website will be on http://localhost:4000/ 
This is for the front-end portion of the dashboard. Currently, there is no backend portion to this website.
```
npm start
```

If the goal is to simply access the website, then go to the ```build``` folder to ```index.html``` to access the website. 

## Docker setup

Currently docker is setup to run the the node project. This will be further expanded onto in the future to include Clowder integration, backend servers, etc

*These commands are written for a UNIX based machine running Docker. Support for windows is uncertain*

Easy command list:
-  To build and run docker container
```sudo docker build --tag avat:latest . && sudo docker run -it --rm -v ${PWD}:/avat -v /AVAT/node_modules -e CHOKIDAR_USEPOLLING=true --name avat -p 3001:3000 avat && sudo docker start avat && sudo docker ps -a | grep avat```
- To stop and remove container
```sudo docker stop avat && sudo docker rm avat```
- To remove pre-existing container and build new container
```sudo docker stop avat && sudo docker rm avat && sudo docker build --tag avat:latest . && sudo docker run -it --rm -v ${PWD}:/avat -v /AVAT/node_modules -e CHOKIDAR_USEPOLLING=true --name avat -p 3001:3000 avat && sudo docker start avat && sudo docker ps -a | grep avat```

## Flask server

There is also support for running this off of a flask server. This will be further expanded on into the future to include any external models and such. 

*These commands are written for a UNIX based machine running Docker. Support for windows is uncertain*

Setup a virtual environment and install the proper dependencies from ```backend/requirements.txt```. Then change current directory to ```backend``` and type in ```flask run```. The website should be up on ```http://127.0.0.1:5000```

## Built With

### FrontEnd
* [React](https://reactjs.org/) - Main Front-End Framework
* [React Bootstrap](https://react-bootstrap.github.io/) - UI Library
* [react-player](https://www.npmjs.com/package/react-player) - Video Player
* [fabric.js](http://fabricjs.com/) - Canvas renderer

## Authors

* **Pradeep Senthil** [pradeepsen99](https://github.com/pradeepsen99) - AVAT
