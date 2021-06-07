import { BoundingBox } from "./bounding_box"

class FrameBoundingBox {
    constructor(frame_data, canvas_width, canvas_height){
        this.frame_data = frame_data;
        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;
        this.windowWidth = 3840;
        this.windowHeight = 2160;
    }

    generate_frame(){
        var bounding_boxes = []
        for (var i = 0; i < this.frame_data.length; i++){
            var color = "#" + ((1<<24)*Math.random() | 0).toString(16)
            console.log(this.frame_data[i])
            var curr_box = new BoundingBox(this.getTop(this.frame_data[i]), this.getLeft(this.frame_data[i]), this.getWidth(this.frame_data[i]), this.getHeight(this.frame_data[i]), color, i, "TEST").generate_no_behavior()
            bounding_boxes.push(curr_box);
        }
        return bounding_boxes
    }



    getWidth(data){
        return Math.floor((data['bbox']['width']/this.windowWidth)*this.canvas_width)
    }

    getHeight(data){
        return Math.floor((data['bbox']['height']/this.windowHeight)*this.canvas_height)
    }

    getTop(data){
        return Math.floor((data['bbox']['x']/this.windowWidth)*this.canvas_height)
    }

    getLeft(data){
        return Math.floor((data['bbox']['y']/this.windowHeight)*this.canvas_height)
    }


}

export {FrameBoundingBox}