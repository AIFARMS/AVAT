import store from '../store'
import {getFrameData, getAnnotationData} from './actions'

export async function downloadFileJSON (ANNOTATION_VIDEO_NAME, ANNOTATOR_NAME, frame_data, annotation_data, VIDEO_METADATA) {
    var fileName = "generated_annotations";
    if(ANNOTATION_VIDEO_NAME !== "" && ANNOTATOR_NAME !== ""){
        fileName = ANNOTATION_VIDEO_NAME.split('.').slice(0, -1).join('.') + "_" +  ANNOTATOR_NAME
    }
    //const json = JSON.stringify(fabricCanvas.getObjects());
    const json = JSON.stringify({"vid_metadata": VIDEO_METADATA, "annotations": frame_data, "behavior_data": store.getState().annotation_data.data})
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


//Legacy code below - Can be refrenced later IF need for CSV is present. Currently broken.
function convert_data_csv(data, columns){
    console.log(columns)
    var csv = new Array(data.length + 1)
    for(var i = 0; i < csv.length; i++){
        csv[i] = []
    }
    csv[0].push("frame_num")
    for(var i = 0; i < columns.length; i++){
        csv[0].push(columns[i]['dataField'])
    }
    for(var i = 0; i < data.length; i++){
        for(var j = 0; j < data[i].length; j++){
            csv[i+1][j]=[];
            var obj = data[i][j]
            var vals = Object.keys((obj)).map(function (key) { return obj[key]; });
            csv[i+1][j] = i + "," + vals.join(",")
        }
        csv[i+1] = csv[i+1].join("\n")
    }
    csv = csv.join("\n")
    return csv
}

export async function downloadFileCSV (ANNOTATION_VIDEO_NAME, ANNOTATOR_NAME, annotation_data, columns) {
    var fileName = "generated_annotations";
    if(ANNOTATION_VIDEO_NAME !== "" && ANNOTATOR_NAME !== ""){
        fileName = ANNOTATION_VIDEO_NAME.split('.').slice(0, -1).join('.') + "_" +  ANNOTATOR_NAME
    }
    var csv = convert_data_csv(annotation_data, columns(""))
    var blob = new Blob([csv],{type:'application/octet-stream'});
    var href = await URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}