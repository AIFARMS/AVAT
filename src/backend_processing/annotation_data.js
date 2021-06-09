import FrameData from './frame_data'

class AnnotationData {
    constructor(num_frames){
        this.data = new Array(num_frames)
        
        for(var i = 0; i < num_frames; i++){
            this.data[i] = []
        }
    }

    addWholeFrameData(frame_num, data){
        this.data[frame_num] = data
    }

    addFrameData(frame_num, id, data){
        this.data[frame_num][id] = data
    }

    addBehavior(frame_num, id){

    }

    getJSON(){

    }
}