const fabric = require("fabric").fabric;
const $ = require("jquery")

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
    var curr_obj = canvas.getActiveObject();
    console.log(curr_obj)
    if(curr_obj == undefined || curr_obj == null){
        alert("Please select a segmentation")
        return
    }/* else if(curr_obj._objects == undefined && curr_obj.points == undefined){
        alert("Please select a segmentation")
        return
    } */
    var poly;
    if(curr_obj.type === "group"){
        poly = curr_obj._objects[0]
        var text = curr_obj._objects[1]['text']
        poly['local_id'] = text
        curr_obj.destroy()
        canvas.remove(curr_obj)
        canvas.add(poly)
    }else if(curr_obj.type === "polygon"){
        poly = curr_obj
    }
    

    canvas.setActiveObject(poly);
    poly.edit = !poly.edit;
    if (poly.edit) {
        var lastControl = poly.points.length - 1;
        poly.cornerStyle = 'circle';
        poly.cornerColor = 'rgba(0,0,255,1)';
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
        if(poly.local_id == undefined){
            alert("Error - missing poly.local_id. Please report this bug in the bug tracker and the steps taken to reproduce this.")
        }
        var points = poly.get('points')
        var new_polygon = new fabric.Polygon(points, {
            strokeWidth: 1,
            stroke: 'green',
            opacity: .5,
            scaleX: 1,
            scaleY: 1,
            objectCaching: false,
            transparentCorners: false,
            cornerColor: 'blue',
            originX: 'center',
            originY: 'center'
        });
        var display_text = new fabric.Text(poly.local_id.toString(), {
            fontSize: 20,
            top: poly.points[0].y,
            left: poly.points[0].x, 
            uniScaleTransform: false,
            fill: "white",
        })

        var grouppo = new fabric.Group([new_polygon, display_text]);
        grouppo['local_id'] = poly.local_id;
        grouppo.lockMovementY = true;
        grouppo.lockMovementX = true;
        grouppo.selectable = true;
        canvas.remove(poly);
        canvas.add(grouppo);
        console.log(canvas.getObjects())
    }
    poly.hasBorders = !poly.edit;
    canvas.requestRenderAll();
}

export {Edit}