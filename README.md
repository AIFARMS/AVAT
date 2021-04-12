# pig-annotation-tool

The front-end dashboard that provides the ability to annotate videos of livestock for the use in research.

## Goals
The goal of this project is to create a tool that is easy to use, has a small learning curve and can scale easily to provide the ability to annotate videos efficiently and at scale. The intuition of this project is gained from analyzing similar projects and analyzing the weaknesses and points of frustration and improving them. 

## Local Deployment (Frontend)

These instructions will get you a copy of the project up and running on your local machine for viweing. This is only for testing the React frontend, for testing both the frontend and backend go to 

### Prerequisites

You will need to have npm, firefox/chrome and git installed on your system for this to work. 

### Installing and Building

First you will need to clone the repository to your desired location

```
git clone https://github.com/AIFARMS/pig-annotation-tool
```

Secondly, you will need to install the node_modules which can be done by:
```
npm install
```
Lastly, run start to get the project running on your local machine. The website will be on http://localhost:4000/ 
This is for the front-end portion of the dashboard. Currently there is no backend portion to this website.
```
npm start
```

If the goal is to simply access the website then go to the ```build``` folder to ```index.html``` to access the website. 

## TODO

### Deployment
* - [x] Have testing build pre-compiled
* - [ ] Live website
* - [ ] Dev website

### View
* - [ ] Button for uploading video
* - [x] Add bounding boxes
* - [x] Bounding boxes have differennt colors
* - [ ] Have two videos playing simultaneously
* - [ ] Show current annotaionns on the side
* - [ ] Add 

### Data Management
* - [ ] Global ID
* - [ ] Export data as CSV or JSON
* - [ ] Import JSON data from Matlab tool
* - [ ] Import previous annotation data to continue annotations

### UI/UX
* - [ ] Clean up UI with Bootstrap CSS+JS
* - [ ] Swap all existing elements over to Bootstrap


## Built With

### FrontEnd
* [React](https://reactjs.org/) - Main Front-End Framework
* [React Bootstrap](https://react-bootstrap.github.io/) - UI Framework
* [React-papaparse](https://github.com/Bunlong/react-papaparse) - CSV Parser
* [react-player](https://www.npmjs.com/package/react-player) - Video Player
* [fabric.js](http://fabricjs.com/) - Canvas renderer

## Authors

* **Pradeep Senthil** [pradeepsen99](https://github.com/pradeepsen99) - Website Developmennt
* **JiangongLi** [jli153](jli153@illinois.edu) - Matlab Tool Development

## Resources Used
* [React Documentation](https://reactjs.org/docs/)
