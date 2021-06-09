class FrameData {
    
    constructor(x, y, width, height, behavior, posture, keypoint, wireframe){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.posture = posture;
        this.keypoint = keypoint;
        this.wireframe = this.wireframe
    }

    //TODO add getters and setters

    getJSON(){
        return [
            {
                "x": this.x
            },
            {
                "y": this.y
            },
            {
                "width": this.width
            },
            {
                "height": this.height
            },
            {
                "behavior": this.behavior
            },
            {
                "posture": this.posture
            },
            {
                "keypoint": this.keypoint
            },
            {
                "wireframe": this.wireframe
            }
        ]
    }
}