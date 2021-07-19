const fabric = require("fabric").fabric;

export function video_to_img(vid_location, fabricCanvas){
    var video1El = document.getElementById('video1');
   
    var video1 = new fabric.Image(video1El, {
      left: 200,
      top: 300,
      angle: -15,
      originX: 'center',
      originY: 'center',
      objectCaching: false,
    });

    
    //fabricCanvas.add(video1);
    //video1.getElement().play();

}