const fabric = require("fabric").fabric;

class BoundingBox {
    constructor(fabricCanvas, color, id, name) {
        this.top = fabricCanvas.height / 2;
        this.left = fabricCanvas.width / 2;
        this.id = id;
        this.name = name;
        this.color = color
    }

    rectangle(){
        return new fabric.Rect({
            hasRotatingPoint: false,
            uniScaleTransform: true,
            height: 50,
            width: 50,
            originX: 'center',
            originY: 'center',
            fill: this.color,
            borderColor: '#000',
            opacity: '.4',
            top: this.top,
            left: this.left,
        });
    } 

    //TODO Add text scaling
    rectangle_id(){
        return new fabric.Text(this.name.toString(), {
            fontSize: 10,
            originX: 'center',
            originY: 'center',
            top: this.top,
            left: this.left,
            uniScaleTransform: false,
          });
    }

    rectangle_behavior(){

    }

    generate_no_behavior(){
        return new fabric.Group([this.rectangle() , this.rectangle_id() ], {
            left: 150,
            top: 100,
          });
    }

    generate_with_behavior(){

    }
}

var text = new fabric.Text('hello world', {
  fontSize: 30,
  originX: 'center',
  originY: 'center'
});

/**var group = new fabric.Group([ , text ], {
  left: 150,
  top: 100,
  angle: -10
});**/

function genetate_bounding_box(){

}

export {BoundingBox, genetate_bounding_box}