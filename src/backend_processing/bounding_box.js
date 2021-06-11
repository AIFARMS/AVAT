import { grep } from "jquery";

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
            height: this.height,
            width: this.width,
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
            fontSize: 20,
            top: this.top,
            left: this.left,
            uniScaleTransform: false,
          });
    }

    behavior(){

    }

    generate_no_behavior(canvas){
        var group = new fabric.Group();
        group.addWithUpdate(this.rectangle())
        group.addWithUpdate(this.id_text())
        
        var temp = this.id 
        group.toObject = (function(toObject) {
            return function(propertiesToInclude) {
                return fabric.util.object.extend(toObject.call(this, propertiesToInclude), {
                    local_id: temp
                });
            };
        })(group.toObject);
        //console.log(group.toJSON())

        canvas.add(group)
        return group
    }

    generate_with_behavior(){

    }
}


function genetate_bounding_box(){

}

export {BoundingBox, genetate_bounding_box}