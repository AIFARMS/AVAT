export default class ExportingAnnotation{
    constructor(annotation_data, canvas){
        this.frame_data = annotation_data
        this.canvas = canvas
    }

    get_frame_json(){
        var standard_annot = []
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
                var x = frame_objects[j]['left'] / this.canvas.width
                var y = frame_objects[j]['top'] / this.canvas.height
                var width = frame_objects[j]['width'] * frame_objects[j]['scaleX']
                var height = frame_objects[j]['height'] * frame_objects[j]['scaleY']
                curr.push({"x": x, "y": y, "width": width, "height": height})
            }
            standard_annot.push(curr)
        }
        return standard_annot
    }

    get_frame_coco(){

    }
}