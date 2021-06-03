export default class Annotation {
    constructor(annotation_json){
        this.objects = annotation_json['objects']
    }

    getObjects() {
        return this.objects
    }

    getObjectById(id) {
        return this.objects[id]
    }

    getObjectByIdFrame(id, frame){
        return this.objects[id][frame]
    }

    getAllObjectByFrame(frame){
        var i;
        for (i = 0; i < this.objects.length; i++){
            var curr_obj = this.objects[i]

        }
    }

}

