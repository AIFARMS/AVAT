const fabric = require("fabric").fabric;

export function video_to_img(vid_location, fabricCanvas){
    var url = URL.createObjectURL(vid_location)

    var inputs = document.getElementsByTagName('video');

    var video1 = new fabric.Image(inputs, {
        left: 200,
        top: 300,
        angle: -15,
        originX: 'center',
        originY: 'center',
        objectCaching: false,
    });

    fabricCanvas.add(video1)
    //video1.getElement().play();
}