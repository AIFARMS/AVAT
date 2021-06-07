export default class Annotation {
    constructor(annotation_json){
        this.objects = annotation_json['objects']
        console.log(this.objects)
    }

    getObjects() {
        return this.objects
    }

    getObjectById(id) {
        return this.objects[id]
    }

    getObjectByIdFrame(id, frame_num){
        return this.objects[id][frame_num]
    }

    getAllObjectByFrame(frame_num){
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

}

