class Annotation {
    constructor(id, behavior, posture, hidden, type, ann){
        this.id = id
        this.behavior = behavior
        this.posture = posture
        this.hidden = hidden
        this.type = type
        this.Annotation = ann
    }

    get_id(){
        return this.id
    }

    set_id(id){
        this.id = id
    }

    get_behavior(){
        return this.behavior
    }

    set_behavior(behavior){
        this.behavior = behavior
    }

    get_posture(){
        return this.behavior
    }

    set_posture(posture){
        this.posture = posture
    }

    get_hidden(){
        return this.hidden
    }

    set_hidden(hidden){
        this.hidden = hidden
    }



    get_type(){
        return this.type
    }

    generate_row(){
        return {id: this.id, behavior: this.behavior, is_hidden: this.hidden, posture: this.posture}
    }
}

export {Annotation}