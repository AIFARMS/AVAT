import React from "react"; 

export default function Instructions(){
    return (
        <div>
        <h3>Keybinds:</h3>

        There are preset keybinds setup to make it easier to use the tool without having to click around. If done properly a combination of mouse and keyboard actions speed up the annotation process. 
        <br></br><br></br>
        * <kbd>1</kbd> : Mode Switch: Behavior<br></br>
        * <kbd>2</kbd> : Mode Switch: Bounding Box<br></br>
        * <kbd>3</kbd> : Mode Switch: Segmentation (Currently Disabled)<br></br>
        * <kbd>a</kbd> : Add annotation<br></br>
        * <kbd>e</kbd> : Skip forward frame(s)<br></br>
        * <kbd>q</kbd> : Skip backward frame(s)<br></br>
        * <kbd>w</kbd> : Pause/Play<br></br>

        <br></br><br></br>
        <h3>Uploading Video:</h3>

        Ensure that you know the framerate of the video chosen to be annotated. These values should be entered into the settings tab into their "frame rate" fields. 
        <br></br><br></br>
        Click on the right side browse button. All other buttons on the screen shuold be disabled until the video has been uploaded. Currenntly ```.mp4``` format is the best choice and tested for. Other file types such as .avi are supported but might have unintended bugs.
        <br></br>
        Please note that videos SHOULD be in 16:9 aspect ratio for best results. Extraneous behavior may occur if resolution is different.
        <br></br><br></br>

        <h3>Uploading Image:</h3>
        Select all of the image files needed for the various inputs. To select a group of images, they should be in the same folder.
        <br></br>
        Please note that images SHOULD be in 16:9 aspect ratio for best results. Extraneous behavior may occur if resolution is different.
        <br></br><br></br>
        <h3>Annotations</h3>
        <br></br>
        There are currently two kinds of annotations. 
        <br></br><br></br>
        <h4>Behavior Annotation:</h4>

        This is for having annotations that do not have any visual attribute attached to it. This annotation is also attached by default when the bounding box or segmentation annotation is created. 

        <br></br><br></br>
        <h4>Bounding Box:</h4>

        This forms a square around the desired object. There should be small squares at the edges of the bounding box which can be used to resize the box. The number on the top left of the box is used to identify the placement of the box in the table to the right.
        <br></br><br></br>
        </div>
    )
}