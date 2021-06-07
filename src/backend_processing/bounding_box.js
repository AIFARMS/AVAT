const fabric = require("fabric").fabric;

class BoundingBox {
    constructor(top, left, width, height, color, id, behavior) {
        this.top = top;
        this.left = left;
        this.id = id;
        this.behavior = behavior;
        this.color = color;
        this.width = width;
        this.height = height;
    }

    rectangle(){
        return new fabric.Rect({
            hasRotatingPoint: false,
            uniScaleTransform: true,
            height: this.width,
            width: this.height,
            fill: this.color,
            borderColor: '#000',
            opacity: '.4',
            top: this.top,
            left: this.left,
        });
    } 

    //TODO Add text scaling
    id_text(){
        return new fabric.Text(this.id.toString(), {
            fontSize: 10,
            top: this.top,
            left: this.left,
            uniScaleTransform: false,
          });
    }

    behavior(){

    }

    generate_no_behavior(){
        return new fabric.Group([this.rectangle() , this.id_text() ], {
            left: this.left,
            top: this.top,
          });
    }

    generate_with_behavior(){

    }
}


function genetate_bounding_box(){

}

export {BoundingBox, genetate_bounding_box}