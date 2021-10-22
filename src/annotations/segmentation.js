import { Edit } from "./segmentation_edit";
const fabric = require("fabric").fabric;
const $ = require("jquery")

class Segmentation {
    generate_polygon(canvas, id, segmentation_flag){
        var min = 99;
        var max = 999999;
        var polygonMode = true;
        var pointArray = new Array();
        var lineArray = new Array();

        var activeLine;
        var activeShape = false;

        var generate_flag = false;

        canvas.forEachObject(function(object){ 
            object.selectable = false; 
            object.evented = false;
        });
        canvas.selection = false;

        var prototypefabric = new function () {
                //canvas = window._canvas = new fabric.Canvas('c');
                //canvas.setWidth($(window).width());
                //canvas.setHeight($(window).height()-$('#nav-bar').height());
                canvas.selection = false;
        
                canvas.on('mouse:down', function (options) {
                    if(options.target && options.target.id === pointArray[0].id){
                        if(generate_flag == false){
                            prototypefabric.polygon.generatePolygon(pointArray);
                            generate_flag = true;
                        }
                    }
                    if(polygonMode){
                        prototypefabric.polygon.addPoint(options);
                    }
                });
                canvas.on('mouse:up', function (options) {
        
                });
                canvas.on('mouse:move', function (options) {
                    if(activeLine && activeLine.class == "line"){
                        var pointer = canvas.getPointer(options.e);
                        activeLine.set({ x2: pointer.x, y2: pointer.y });
        
                        var points = activeShape.get("points");
                        points[pointArray.length] = {
                            x:pointer.x,
                            y:pointer.y
                        }
                        activeShape.set({
                            points: points
                        });
                        canvas.renderAll();
                    }
                    //canvas.renderAll();
                });
        }();
        
        
        
        prototypefabric.polygon = {
            drawPolygon : function() {
                polygonMode = true;
                pointArray = new Array();
                lineArray = new Array();
            },
            addPoint : function(options) {
                var CIRCLE_RADIUS = 2;
                var random = Math.floor(Math.random() * (max - min + 1)) + min;
                var temp_id = new Date().getTime() + random;
                var circle = new fabric.Circle({
                    id: temp_id,
                    radius: 2,
                    fill: '#ffffff',
                    stroke: '#333333',
                    strokeWidth: 0.5,
                    left: (options.e.layerX/canvas.getZoom()),
                    top: (options.e.layerY/canvas.getZoom()),
                    selectable: false,
                    hasBorders: false,
                    hasControls: false,
                    originX:'center',
                    originY:'center',
                    objectCaching:false
                });
                circle.selectable = false;
                if(pointArray.length === 0){
                    circle.set({
                        fill:'red',
                        zindex: 1
                    })
                }else{
                    circle.set({
                        zindex: 0
                    })
                }
                

                var points = [(options.e.layerX/canvas.getZoom()),(options.e.layerY/canvas.getZoom()),(options.e.layerX/canvas.getZoom()),(options.e.layerY/canvas.getZoom())];
                var line = new fabric.Line(points, {
                    strokeWidth: 2,
                    fill: '#999999',
                    stroke: '#999999',
                    class:'line',
                    originX:'center',
                    originY:'center',
                    selectable: false,
                    hasBorders: false,
                    hasControls: false,
                    evented: false,
                        objectCaching:false
                });
                if(activeShape){
                    var pos = canvas.getPointer(options.e);
                    var points = activeShape.get("points");
                    points.push({
                        x: pos.x,
                        y: pos.y
                    });
                    var polygon = new fabric.Polygon(points,{
                        stroke:'#333333',
                        strokeWidth:1,
                        fill: '#cccccc',
                        opacity: 0.3,
                        selectable: false,
                        hasBorders: false,
                        hasControls: false,
                        evented: false,
                        objectCaching:false
                    });
                    canvas.remove(activeShape);
                    canvas.add(polygon);
                    activeShape = polygon;
                    canvas.renderAll();
                }
                else{
                    var polyPoint = [{x:(options.e.layerX/canvas.getZoom()),y:(options.e.layerY/canvas.getZoom())}];
                    console.log(polyPoint)
                    var polygon = new fabric.Polygon(polyPoint,{
                        stroke:'#333333',
                        strokeWidth:1,
                        fill: '#cccccc',
                        opacity: 0.3,
                        selectable: false,
                        hasBorders: false,
                        hasControls: false,
                        evented: false,
                        objectCaching:false
                    });
                    activeShape = polygon;
                    canvas.add(polygon);
                }
                activeLine = line;
        
                pointArray.push(circle);
                lineArray.push(line);
        
                canvas.add(line);
                canvas.add(circle);
                canvas.selection = false;
            },
            generatePolygon : function(pointArray){
                var points = new Array();
                $.each(pointArray,function(index,point){
                    points.push({
                        x:point.left,
                        y:point.top
                    });
                    canvas.remove(point);
                });
                $.each(lineArray,function(index,line){
                    canvas.remove(line);
                });

                console.log(pointArray)
                console.log(lineArray)

                var po = new fabric.Polygon(points, {
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

                /*po.toObject = (function(toObject) {
                    return function(propertiesToInclude) {
                        return fabric.util.object.extend(toObject.call(this, propertiesToInclude), {
                            local_id: id
                        });
                    };
                })(po.toObject)*/
                po['local_id'] = id
                po.lockMovementY = true;
                po.lockMovementX = true;
                console.log(id)
                console.log(po)

                canvas.remove(activeShape);
                //canvas.add(po);

                segmentation_flag();

                var display_text = new fabric.Text(id.toString(), {
                    fontSize: 20,
                    centerX: "center",
                    top: pointArray[0].top,
                    left: pointArray[0].left, 
                    uniScaleTransform: false,
                    fill: "white",
                })

                var grouppo = new fabric.Group([po, display_text], {

                })
                grouppo.lockMovementY = true;
                grouppo.lockMovementX = true;
                grouppo.selectable = false;
                grouppo['local_id'] = id

                canvas.add(grouppo)
                //canvas.setActiveObject(grouppo)
                //Edit(canvas)
                console.log(grouppo._objects[0])
                console.log(grouppo)
                  
                canvas.remove(activeLine);
                canvas.remove(activeShape)
                //canvas.add(polygon);
        
                activeLine = null;
                activeShape = null;
                polygonMode = false;
                //canvas.selection = true;

                canvas.forEachObject(function(object){ 
                    object.selectable = true; 
                });

                //return group
            }
        };
        
        
        //return prototypefabric.polygon.drawPolygon();
    }
}

export {Segmentation}