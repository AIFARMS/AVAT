## Instructions 

Follow these instructions to get the most out of the tool.

### Keybinds:

There are preset keybinds setup to make it easier to use the tool without having to click around. If done properly a combination of mouse and keyboard actions speed up the annotation process. 

* <kbd>1</kbd> : Mode Switch: Behavior Annotation
* <kbd>2</kbd> : Mode Switch: Bounding Box
* <kbd>a</kbd> : Add annotation
* <kbd>r</kbd> : Remove selected annotation
* <kbd>q</kbd> : Skip backward frame(s)
* <kbd>s</kbd> : Save annotation
* <kbd>w</kbd> : Pause/Play
* <kbd>e</kbd> : Skip forward frame(s)

## Uploading Video:
Ensure that you know the framerate of the video chosen to be annotated. These values should be entered into the settings tab into their "frame rate" fields.

Click on the right side browse button. All other buttons on the screen shuold be disabled until the video has been uploaded. Currenntly ```.mp4``` format is the best choice and tested for. Other file types such as .avi are supported but might have unintended bugs.
Please note that videos SHOULD be in 16:9 aspect ratio for best results. Extraneous behavior may occur if resolution is different.

## Uploading Image:
Select all of the image files needed for the various inputs. To select a group of images, they should be in the same folder.
Please note that images SHOULD be in 16:9 aspect ratio for best results. Extraneous behavior may occur if resolution is different.

## Annotations

There are currently two kinds of annotations.

### Behavior Annotation:
This is for having annotations that do not have any visual attribute attached to it. This annotation should be used for behavior, posture, etc labeling. Click on ```1``` and ```a``` to add this annotation.

### Bounding Box:
This forms a square around the desired object. There should be small squares at the edges of the bounding box which can be used to resize the box. The number on the top left of the box is used to identify the placement of the box in the table to the right, this corresponds to the id of the corresponding annotation. To add this click on ```2``` and ```a```to add this annotation.


## Annotation Process

With knowledge of the keybinds and the annotation types the annotation process can begin. First upload a video by selecting the ***right*** Browse button. After that go to ```settings``` and enter your name under the "Annotator Name" textbox. After that you may proceed with annotating the video normally using the <kbd>a</kbd> key. Changing the modes as needed using their respective key-binds and changing the values on the table. 

***If any bugs are present please use the Report button on the top toolbar to fillout the Google form with the relevant information***