export default async function videoFrameExtract(frame_rate, skip_val, handleText){
    
    //alert("Video will be extracted into frames - This might take a bit!")
    const video = document.getElementById("process_vid")
    var total_frames = video.duration * frame_rate
    console.log(total_frames)
    console.log(video.duration)

    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let [w, h] = [video.videoWidth, video.videoHeight]
    canvas.width =  w;
    canvas.height = h;

    let frames = [];
    context.drawImage(video, 0, 0, w, h);
    let base64ImageData = canvas.toDataURL();
    frames.push(base64ImageData);

    let seekResolve;
    video.addEventListener('seeked', async function() {
      if(seekResolve) seekResolve();
    });

    for(var i = 1; i < total_frames; i=i+skip_val){
        var new_time = parseFloat((i/total_frames)*video.duration)
        console.log(new_time)
        video.currentTime = new_time
        handleText(((i/(total_frames-1))*100).toFixed(2).toString() + "%" + "completed" + "    |   " + (i+1).toString() + "/" + total_frames.toString() + " frames processed.")

        await new Promise(r => seekResolve=r);

        context.drawImage(video, 0, 0, w, h);
        let base64ImageData = canvas.toDataURL();
        frames.push(base64ImageData);
    }
    //console.log(frames)
    return frames
}