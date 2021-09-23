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
        group.borderColor = '#000000'
        group.hasBorders = true

        var temp = this.id 
        group.toObject = (function(toObject) {
            return function(propertiesToInclude) {
                return fabric.util.object.extend(toObject.call(this, propertiesToInclude), {
                    local_id: temp
                });
            };
        })(group.toObject);
        console.log(group.toJSON())

        //canvas.add(group)

        function onChange(obj) {
            var circle = obj.target.item(1),
                group = obj.target,
                scaleX = group.width / (group.width * group.scaleX),
                scaleY = group.height / (group.height * group.scaleY);
            circle.set('scaleX', scaleX);
            circle.set('scaleY', scaleY);
        }
        canvas.on({
            'object:scaling': onChange
        })
        return group
    }

    generate_mouse_no_behavior(canvas){
        var group, isDown, origX, origY;

        var temp_id = new fabric.Text(this.id.toString(), {
            fontSize: 20,
            top: this.top,
            left: this.left,
            uniScaleTransform: false,
          });

        canvas.on('mouse:down', function(o){
            isDown = true;
            var pointer = canvas.getPointer(o.e);
            origX = pointer.x;
            origY = pointer.y;
            var pointer = canvas.getPointer(o.e);
            var rect_temp = new fabric.Rect({
                left: origX,
                top: origY,
                originX: 'left',
                originY: 'top',
                width: pointer.x-origX,
                height: pointer.y-origY,
                angle: 0,
                fill: 'rgba(255,0,0,0.5)',
                transparentCorners: false,
                uniScaleTransform: true
            });
            group = rect_temp


            canvas.add(group)
        });
        
        canvas.on('mouse:move', function(o){
            if (!isDown) return;
            var pointer = canvas.getPointer(o.e);
            
            if(origX>pointer.x){
                group.set({ left: Math.abs(pointer.x) });
            }
            if(origY>pointer.y){
                group.set({ top: Math.abs(pointer.y) });
            }
            
            group.set({ width: Math.abs(origX - pointer.x) });
            group.set({ height: Math.abs(origY - pointer.y) });
            
            
            canvas.renderAll();
        });
        
        canvas.on('mouse:up', function(o){
          isDown = false;
          canvas.off('mouse:down')
          canvas.off('mouse:up')
        });
    }

    generate_with_behavior(){

    }
}


function genetate_bounding_box(){

}

export {BoundingBox, genetate_bounding_box}