# pig-annotation-tool

The front-end dashboard that provides the ability to annotate videos of livestock for the use in research.

## Goals
The goal of this project is to create a tool that is easy to use, has a small learning curve and can scale easily to provide the ability to annotate videos efficiently and at scale. The intuition of this project is gained from analyzing similar projects and analyzing the weaknesses and points of frustration and improving them. 

## Feedback + Bud Report + Feature Suggesions

For any feedback, bug repots and feature suggesions please use this form: https://forms.gle/gEbAkvc39NC8p2Pt8

## Local Deployment (Frontend)

These instructions will get you a copy of the project up and running on your local machine for viweing. 

### Prerequisites:

You will need to have npm, firefox/chrome and git installed on your system for this to work. 

### Installing and Building:

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

## Instructions 

Follow these instructions to get the most out of the tool.

### Keybinds:

There are preset keybinds setup to make it easier to use the tool without having to click around. If done properly a combination of mouse and keyboard actions speed up the annotation process. 

* <kbd>1</kbd> : Mode Switch: Bounding Box
* <kbd>2</kbd> : Mode Switch: Key Point
* <kbd>3</kbd> : Mode Switch: Segmentation
* <kbd>a</kbd> : Add annotation
* <kbd>r</kbd> : Remove selected annotation
* <kbd>q</kbd> : Skip backward frame(s)
* <kbd>s</kbd> : Save annotation
* <kbd>w</kbd> : Pause/Play
* <kbd>e</kbd> : Skip forward frame(s)

### Uploading Video:

Ensure that you know the framerate, vertical and horizontal resolution of the video chosen to be annotated. These values should be entered into the settings tab into their respective fields. 

Click on the right side browse button. All other buttons on the screen shuold be disabled until the video has been uploaded. Currenntly ```.mp4``` format is the best choice and tested for. 

## Annotations

There are currently three kinds of annotations. 

### Bounding Box:

This forms a square around the desired object. There should be small squares at the edges of the bounding box which can be used to resize the box. The number on the top left of the box is used to identify the placement of the box in the table to the right.

### Key Point:

This generates an object with multiple points and lines attached to each other. They should be arranged around the obejct where the singular circle with one connecting line is the head and progress to each of the other limbs. 

***Note: This feature is currently in development and there will be bugs in using this.***

### Segmentation:

Upon generating this each click on the video generates a point which eventually will transform to a set of interconnected points. To complete the polygon click on the original point generated (which is the red colored point)

***Note: Unline the Bounding Box, segmentation cant be edited after generated. To fix a mistake remove the annotation and continue from the start.***


## Backend Structure:

This is a breif overview with the goals and strucutre that the project was designed around. For more detailed information please look into the respective file's documentation for implementation details. There are many files but the most important ones are outlined below. 

### React Components:

The proect is designed in such a way that if any new features are needed to be added they can be made into react-compomnents. Currently there are 3 main components that being ```main_youtube```, ```main_upload``` and ```change_table```. As more features and needs arise this should be updated to reflect that.

These files are stored under the ```src/ui_elements``` folder.

### Fabric.js Components:

Similar to how the react components are structured, each of the types of annotations are split up into their own respective file. Under the ```backend_processing``` folder there should be ```bounding_box.js```, ```key_point.js``` and ```segmentation.js``` which represent the respective annotation types. To add more types simply add a file to the folder and follow the similar format to what's on there to add it into the main proejct. 


## TODO

### Deployment:
* - [x] Have testing build pre-compiled
* - [x] Dev website
* - [ ] Live website

### Features
* - [x] Bounding Boxes
* - [x] Segmentation
* - [x] Change global_id manually
* - [x] Change behavior manually
* - [x] Change posture manually
* - [ ] Key Point
* - [ ] Ability to scale with screen/computer resolution
* - [ ] Display annotations on the side
* - [ ] Persisting annotations through frames

### Extra Features
* - [ ] Have the frame follow the animal's movement through the frames
* - [ ] Automatically guesstimate boxes for pigs based on background subtraction
* - [ ] 

### Data Management
* - [x] Export data as CSV or JSON
* - [x] Global ID
* - [ ] Import JSON data from Matlab tool
* - [ ] Import previous annotation data to continue annotations
* - [ ] Seperate file for behavior + posture + column list
* - [ ] Store time (seconds) along with frame data
* - [ ] Combine annotation_data with frame_data instead of 2 seperate files


## Built With

### FrontEnd
* [React](https://reactjs.org/) - Main Front-End Framework
* [React Bootstrap](https://react-bootstrap.github.io/) - UI Framework
* [React-papaparse](https://github.com/Bunlong/react-papaparse) - CSV Parser
* [react-player](https://www.npmjs.com/package/react-player) - Video Player
* [fabric.js](http://fabricjs.com/) - Canvas renderer

## Authors

* **Pradeep Senthil** [pradeepsen99](https://github.com/pradeepsen99) - Web-tool Developmennt
* **JiangongLi** [jli153](jli153@illinois.edu) - Matlab Tool Development

## Resources Used
* [React Documentation](https://reactjs.org/docs/)
