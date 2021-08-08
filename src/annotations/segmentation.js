const fabric = require("fabric").fabric;
const $ = require("jquery")

class Segmentation {
    generate_polygon(canvas, id){
        var min = 99;
        var max = 999999;
        var polygonMode = true;
        var pointArray = new Array();
        var lineArray = new Array();

        var activeLine;
        var activeShape = false;

        canvas.forEachObject(function(object){ 
            object.selectable = false; 
        });

        var prototypefabric = new function () {
                //canvas = window._canvas = new fabric.Canvas('c');
                //canvas.setWidth($(window).width());
                //canvas.setHeight($(window).height()-$('#nav-bar').height());
                canvas.selection = false;
        
                canvas.on('mouse:down', function (options) {
                    if(options.target && options.target.id === pointArray[0].id){
                        prototypefabric.polygon.generatePolygon(pointArray);
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
                    canvas.renderAll();
                });
        }();
        
        
        
        prototypefabric.polygon = {
            drawPolygon : function() {
                polygonMode = true;
                pointArray = new Array();
                lineArray = new Array();
            },
            addPoint : function(options) {
                var random = Math.floor(Math.random() * (max - min + 1)) + min;
                var id = new Date().getTime() + random;
                var circle = new fabric.Circle({
                    radius: 5,
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
                    id:id,
                        objectCaching:false
                });
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


                var group = new fabric.Group()
                for (var i = 0; i < pointArray.length; i++){
                    group.addWithUpdate(pointArray[i])
                    group.addWithUpdate(lineArray[i])
                }
                
                /*group.addWithUpdate(new fabric.Text(id.toString(), {
                    fontSize: 20,
                    centerX: "center",
                    top: pointArray[0].top,
                    left: pointArray[0].left, 
                    uniScaleTransform: false,
                  }));
                */
               //To add custom id
                group.toObject = (function(toObject) {
                    return function(propertiesToInclude) {
                        return fabric.util.object.extend(toObject.call(this, propertiesToInclude), {
                            local_id: id
                        });
                    };
                })(group.toObject);

                canvas.add(group)
                  
                canvas.remove(activeLine);
                canvas.remove(activeShape)
                //canvas.add(polygon);
        
                activeLine = null;
                activeShape = null;
                polygonMode = false;
                canvas.selection = true;

                canvas.forEachObject(function(object){ 
                    object.selectable = true; 
                });

                return group
            }
        };
        
        
        //return prototypefabric.polygon.drawPolygon();
    }
}

export {Segmentation}