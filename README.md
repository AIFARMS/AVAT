# AVAT

The front-end dashboard that provides the ability to annotate videos of livestock for the use in research.

## Goals
The goal of this project is to create a tool that is easy to use, has a small learning curve and can scale easily to provide the ability to annotate videos efficiently and at scale. The intuition of this project is gained from analyzing similar projects and analyzing the weaknesses and points of frustration and improving them. Another goal is to have an annotation workflow that is extremely fast and efficient, as there are terabytes of video that needs to be processed at large. 

## Feedback + Bug Report + Feature Suggestions

For any feedback, bug repots and feature suggestions please use this form: https://forms.gle/gEbAkvc39NC8p2Pt8

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

### Browser Support

The below listed browsers should be compatible. If any errors persist please use the latest version of Chrome or Firefox as those have ben extensively tested.

* Chrome 49 (release: 2/3/2016)
* Firefox 50 (release: 11/15/2016)
* Safari 10 (release: 9/20/2016)
* Edge 14 (release: 2/18/2016)

## Backend Structure:

This is a breif overview with the goals and strucutre that the project was designed around. For more detailed information please look into the respective file's documentation for implementation details. There are many files but the most important ones are outlined below. 

### React Components:

The project is designed in such a way that if any new features are needed to be added they can be made into react-compomnents. Currently, there are 3 main components that being ```main_youtube```, ```main_upload``` and ```change_table```. As more features and needs arise, this should be updated to reflect that.

These files are stored under the ```src/ui_elements``` folder.

### Fabric.js Components:

Similar to how the react components are structured, each of the types of annotations are split up into their own respective file. Under the ```backend_processing``` folder there should be ```bounding_box.js```, ```key_point.js``` and ```segmentation.js``` which represent the respective annotation types. To add more types simply add a file to the folder and follow the similar format to what's on there to add it into the main project. 


## Built With

### FrontEnd
* [React](https://reactjs.org/) - Main Front-End Framework
* [React Bootstrap](https://react-bootstrap.github.io/) - UI Library
* [react-player](https://www.npmjs.com/package/react-player) - Video Player
* [fabric.js](http://fabricjs.com/) - Canvas renderer

## Authors

* **Pradeep Senthil** [pradeepsen99](https://github.com/pradeepsen99) - AVAT
* **JiangongLi** [jli153](jli153@illinois.edu) - Matlab Tool Development
