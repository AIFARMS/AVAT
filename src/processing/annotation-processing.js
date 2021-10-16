export default class ExtractingAnnotation{
    constructor(annotation_json){
        this.frame_data = annotation_json['annotations']
        this.annotation_data = annotation_json['behavior_data']
    }

    get_frame_data(){
        return this.frame_data
    }
    
    get_annotation_data(){
        return this.annotation_data
    }
}

export class ExportingAnnotation{
    constructor(annotation_data){
        this.frame_data = annotation_data
    }

    get_frame_json(){
        for(var i = 0; i < this.frame_data.length; i++){
            var frame_objects = this.frame_data[i]['objects']
            for(var j = 0; j < this.frame_objects.length; j++){
                var x = frame_objects[j]['left']
                var y = frame_objects[j]['']
            }
        }
    }

    get_frame_coco(){

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