## Instructions 

Follow these instructions to get the most out of the tool.

### Keybinds:

There are preset keybinds setup to make it easier to use the tool without having to click around. If done properly a combination of mouse and keyboard actions speed up the annotation process. 

* <kbd>1</kbd> : Mode Switch: Behavior Annotation
* <kbd>2</kbd> : Mode Switch: Bounding Box
* <kbd>3</kbd> : Mode Switch: Key Point
* <kbd>4</kbd> : Mode Switch: Segmentation
* <kbd>a</kbd> : Add annotation
* <kbd>r</kbd> : Remove selected annotation
* <kbd>q</kbd> : Skip backward frame(s)
* <kbd>s</kbd> : Save annotation
* <kbd>w</kbd> : Pause/Play
* <kbd>e</kbd> : Skip forward frame(s)
* <kbd>f</kbd> : Activate/Deactivate scrub mode (Activated by default)
* <kbd>c</kbd> : Copy previous annotation

### Uploading Video:

Ensure that you know the framerate, vertical and horizontal resolution of the video chosen to be annotated. These values should be entered into the settings tab into their respective fields. 

Click on the right side browse button. All other buttons on the screen shuold be disabled until the video has been uploaded. Currenntly ```.mp4``` format is the best choice and tested for. 

## Annotations

There are currently four kinds of annotations. 

### Behavior Annotation:

This does not have a visual element. Instead this adds a row onto the the table so that behavior and behavior changes may be recorded.

### Bounding Box:

This forms a square around the desired object. There should be small squares at the edges of the bounding box which can be used to resize the box. The number on the top left of the box is used to identify the placement of the box in the table to the right.

### Key Point:

This generates an object with multiple points and lines attached to each other. They should be arranged around the obejct where the singular circle with one connecting line is the head and progress to each of the other limbs. 

***Note: This feature is currently in development and there will be bugs in using this.***

### Segmentation:

Upon generating this each click on the video generates a point which eventually will transform to a set of interconnected points. To complete the polygon click on the original point generated (which is the red colored point)

***Note: Unline the Bounding Box, segmentation cant be edited after generated. To fix a mistake remove the annotation and continue from the start.***

## Annotation Process

With knowledge of the keybinds and the annotation types the annotation process can begin. First upload a video by selecting the ***right*** Browse button. After that go to ```settings``` and enter your name under the "Annotator Name" textbox. After that you may proceed with annotating the video normally using the <kbd>a</kbd> key. Changing the modes as needed using their respective key-binds and changing the values on the table. 

***If any bugs are present please use the Report button on the top toolbar to fillout the Google form with the relevant information***
