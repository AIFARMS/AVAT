export default class ExportingAnnotation{
    constructor(annotation_data, canvas, VIDEO_METADATA){
        this.frame_data = annotation_data
        this.canvas = canvas
        this.metadata = VIDEO_METADATA
    }

    get_frame_json(){
        var standard_annot = new Array(this.frame_data.length)
        console.log(this.metadata)
        for(var i = 0; i < this.frame_data.length; i++){
            var curr = []
            if(this.frame_data[i] == []){
                continue;
            }
            var frame_objects = this.frame_data[i]['objects']
            if(frame_objects == undefined){
                continue;
            }
            for(var j = 0; j < frame_objects.length; j++){

                if(frame_objects[j]['objects'][0]['type'] === "rect"){
                    console.log(frame_objects[j])
                    var x = (frame_objects[j]['left'] / this.canvas.width) * this.metadata['horizontal_res']
                    var y = (frame_objects[j]['top'] / this.canvas.height) * this.metadata['vertical_res']
                    var width = ((frame_objects[j]['width'] * frame_objects[j]['scaleX']) / this.canvas.width) * this.metadata['horizontal_res']
                    var height = ((frame_objects[j]['height'] * frame_objects[j]['scaleY']) / this.canvas.height )* this.metadata['vertical_res']
                    var local_id = frame_objects[j]['objects'][1]['text']
                    curr.push({"type": "bounding_box","x": x, "y": y, "width": width, "height": height, "local_id": local_id})
                }else if (frame_objects[j]['objects'][0]['type'] === "polygon"){
                    var raw_points = frame_objects[j]['objects'][0]['points']
                    var points = []
                    for(var k = 0; k < raw_points.length; k++){
                        var x = (raw_points[k]['x'] / this.canvas.width) * this.metadata['horizontal_res']
                        var y = (raw_points[k]['y'] / this.canvas.height) * this.metadata['vertical_res']
                        points.push({"x": x, "y": y})
                    }
                    curr.push({"type": "segmentation", "points": points})
                }

            }
            standard_annot[i] = curr
        }
        return standard_annot
    }

    get_frame_coco(){

    }
}