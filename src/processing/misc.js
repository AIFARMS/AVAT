
export async function downloadFileJSON (ANNOTATION_VIDEO_NAME, ANNOTATOR_NAME, frame_data, annotation_data, VIDEO_METADATA) {
    var fileName = "generated_annotations";
    if(ANNOTATION_VIDEO_NAME !== "" && ANNOTATOR_NAME !== ""){
        fileName = ANNOTATION_VIDEO_NAME.split('.').slice(0, -1).join('.') + "_" +  ANNOTATOR_NAME
    }
    console.log(annotation_data)
    //const json = JSON.stringify(fabricCanvas.getObjects());
    const json = JSON.stringify({"vid_metadata": VIDEO_METADATA, "annotations": frame_data, "behavior_data": annotation_data})
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

function convert_JSON_csv(json, columns){
    console.log(columns)
    
}

export async function downloadFileCSV (ANNOTATION_VIDEO_NAME, ANNOTATOR_NAME, annotation_data) {
    var csv = convert_JSON_csv(annotation_data)
}