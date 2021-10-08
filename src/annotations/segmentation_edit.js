const fabric = require("fabric").fabric;
const $ = require("jquery")

// define a function that can locate the controls.
// this function will be used both for drawing and for interaction.
function polygonPositionHandler(dim, finalMatrix, fabricObject) {
    var x = (fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x),
        y = (fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y);

    return fabric.util.transformPoint(
        { x: x, y: y },
        fabric.util.multiplyTransformMatrices(
            fabricObject.canvas.viewportTransform,
            fabricObject.calcTransformMatrix()
        )
    );
}

// define a function that will define what the control does
// this function will be called on every mouse move after a control has been
// clicked and is being dragged.
// The function receive as argument the mouse event, the current trasnform object
// and the current position in canvas coordinate
// transform.target is a reference to the current object being transformed,
function actionHandler(eventData, transform, x, y) {
    var polygon = transform.target,
        currentControl = polygon.controls[polygon.__corner],
        mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center'),
    polygonBaseSize = polygon._getNonTransformedDimensions(),
            size = polygon._getTransformedDimensions(0, 0),
            finalPointPosition = {
                x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
                y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
            };
    polygon.points[currentControl.pointIndex] = finalPointPosition;
    return true;
}

// define a function that can keep the polygon in the same position when we change its
// width/height/top/left.
function anchorWrapper(anchorIndex, fn) {
    return function(eventData, transform, x, y) {
        var fabricObject = transform.target,
            absolutePoint = fabric.util.transformPoint({
                x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
                y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y),
            }, fabricObject.calcTransformMatrix()),
            actionPerformed = fn(eventData, transform, x, y),
            newDim = fabricObject._setPositionDimensions({}),
            polygonBaseSize = fabricObject._getNonTransformedDimensions(),
            newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x,
                newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
        fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
        return actionPerformed;
    }
}

function Edit(canvas) {
    // clone what are you copying since you
    // may want copy and paste on different moment.
    // and you do not want the changes happened
    // later to reflect on the copy.
    var group = canvas.getActiveObject();
    if(group == undefined || group == null){
        alert("Please select a segmentation")
        return
    }
    
    if(group._objects == undefined && group.points == undefined){
        alert("Please select a segmentation")
        return
    }
    var poly;
    if(group.points == undefined){
        poly = group._objects[0]
        var text = group._objects[1]
        group.destroy()
        //canvas.remove(text)
        //canvas.remove(poly)
        //canvas.remove(group)
        canvas.add(poly)
    }else{
        poly = group
    }
    

    canvas.setActiveObject(poly);
    poly.edit = !poly.edit;
    if (poly.edit) {
        var lastControl = poly.points.length - 1;
        poly.cornerStyle = 'circle';
        poly.cornerColor = 'rgba(0,0,255,0.5)';
        poly.controls = poly.points.reduce(function(acc, point, index) {
                acc['p' + index] = new fabric.Control({
                    positionHandler: polygonPositionHandler,
                    actionHandler: anchorWrapper(index > 0 ? index - 1 : lastControl, actionHandler),
                    actionName: 'modifyPolygon',
                    pointIndex: index
                });
                return acc;
            }, { });
    } else {
        poly.cornerColor = 'blue';
        poly.cornerStyle = 'rect';
        poly.controls = fabric.Object.prototype.controls;
        
        var display_text = new fabric.Text(poly.local_id.toString(), {
            fontSize: 20,
            top: poly.points[0].y,
            left: poly.points[0].x, 
            uniScaleTransform: false,
            fill: "white",
        })

        var grouppo = new fabric.Group([poly, display_text]);
        grouppo['local_id'] = poly.local_id;
        grouppo.lockMovementY = true;
        grouppo.lockMovementX = true;
        canvas.remove(poly);
        canvas.add(grouppo);
        console.log(grouppo);

    }
    poly.hasBorders = !poly.edit;
    canvas.requestRenderAll();
}

export {Edit}