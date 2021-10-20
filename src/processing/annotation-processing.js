import {BoundingBox} from '../annotations/bounding_box'

export default class ExtractingAnnotation{
    constructor(annotation_json, canvas){
        this.frame_data = annotation_json['annotations']
        this.annotation_data = annotation_json['behavior_data']
        this.canvas = canvas
        this.metadata = annotation_json['vid_metadata']
    }

    get_frame_data(){
        return this.scale_annotations()
    }
    
    get_annotation_data(){
        return this.annotation_data
    }

    scale_annotations(){
        var new_annotations = []
        console.log(this.frame_data)
        for(var i = 0; i < this.frame_data.length; i++){
            var temp_data = []
            var curr_frame = this.frame_data[i]
            if(curr_frame == null){
                new_annotations.push([])
                continue;
            }
            for(var j = 0; j < curr_frame.length; j++){
                if(curr_frame[j]['type'] === "bounding_box"){
                    var x = (parseInt(curr_frame[j]['x']) / parseInt(this.metadata['horizontal_res']) * this.canvas.width)
                    var y = (curr_frame[j]['y'] / this.metadata['vertical_res'] * this.canvas.height)
                    var width = ((curr_frame[j]['width']) / this.metadata['horizontal_res'] * this.canvas.width)
                    var height = ((curr_frame[j]['height']) / this.metadata['vertical_res'] * this.canvas.height)
                    console.log(x)
                    //console.log(curr_frame[j])
                    //console.log(this.metadata)
                    //console.log(this.canvas.width)
                    var color = "#" + ((1<<24)*Math.random() | 0).toString(16)
                    var new_bbox = new BoundingBox(y, x, width, height, color, curr_frame[j]['local_id'], "None").generate_no_behavior(this.canvas)
                    //this.canvas.add(new_bbox)
                    temp_data.push(new_bbox)
                }else if(curr_frame[j]['type'] === "segmentation"){

                }
            }
            new_annotations.push({"objects": temp_data})
        }
        console.log(new_annotations)
        return new_annotations
    }
}

//This is the parser for the Multi-Camera pig tracking output JSON code. 
/*
class MCPT_Processing {
    constructor(annotation_json){
        this.objects = annotation_json['objects']
        console.log(this.objects)
    }

    getObjects_MCPT() {
        return this.objects
    }

    getObjectById_MCPT(id) {
        return this.objects[id]
    }
    
    getObjectByIdFrame(id, frame_num){
        return this.objects[id][frame_num]
    }

    getAllObjectByFrame_MCPT(frame_num){
        var i;
        var objects_frame = []
        for (i = 0; i < this.objects.length; i++){
            var curr_obj = this.objects[i]
            if(curr_obj['frames'][curr_obj['frames'].length-1]['frameNumber'] < frame_num){
                continue;
            }
            var curr_obj_frames = curr_obj['frames'];
            for (var j = 0; j < curr_obj_frames.length; j++){
                if(curr_obj_frames[j]['frameNumber'] === frame_num){
                    objects_frame.push(curr_obj_frames[j]);
                    break;
                }
            }
        }
        console.log(objects_frame)
        return objects_frame;
    }
}*/