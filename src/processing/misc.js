
export async function downloadFile (ANNOTATION_VIDEO_NAME, ANNOTATOR_NAME, frame_data, annotation_data) {
    var fileName = "generated_annotations";
    if(ANNOTATION_VIDEO_NAME !== "" && ANNOTATOR_NAME !== ""){
        fileName = ANNOTATION_VIDEO_NAME.split('.').slice(0, -1).join('.') + "_" +  ANNOTATOR_NAME
    }
    //const json = JSON.stringify(fabricCanvas.getObjects());
    const json = JSON.stringify({"annotations": frame_data, "behavior_data": annotation_data})
    //var json = JSON.stringify(frame_data);
    var blob = new Blob([json],{type:'application/json'});
    var href = await URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

