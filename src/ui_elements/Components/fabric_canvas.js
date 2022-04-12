import React, { useEffect, useState } from "react"; 
import ReactDOM from 'react-dom'

import store from '../../store' 
import {initFrameData, updateFrameData, getFrameData, 
		initAnnotationData, updateAnnotationData, getAnnotationData, 
		initColumnData, getColumnData, 
		initCurrentFrame, getCurrentFrame, setCurrentFrame,} from '../../processing/actions'
import { useSelector } from "react-redux";

import {INPUT_IMAGE, INPUT_VIDEO} from '../../static_data/const'

const fabric = require("fabric").fabric;

var fabricCanvas = new fabric.Canvas('c', {
	uniScaleTransform: true,
	uniformScaling: false,
	includeDefaultValues: false
});

fabricCanvas.on('mouse:over', function(e) {
	if(e.target == null){
		return;
	}else if(e.target['_objects'] == undefined){
		return;
	}	
		temp_color = e.target['_objects'][0].get('fill')
	e.target['_objects'][0].set('fill', "#39FF14");
		fabricCanvas.renderAll();
});

fabricCanvas.on('mouse:out', function(e) {
  if(e.target == null){
	return;
  }else if(e.target['_objects'] == undefined){
	return;
  }
  e.target['_objects'][0].set('fill', temp_color);
	fabricCanvas.renderAll();
});

fabric.Image.prototype.toObject = (function(toObject) {
  return function() {
	return fabric.util.object.extend(toObject.call(this), {
	src: this.toDataURL()
	});
  };
  })(fabric.Image.prototype.toObject);

fabricCanvas.on('mouse:wheel', function(opt) {
  var delta = opt.e.deltaY;
  var zoom = fabricCanvas.getZoom();
  
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
  });

fabricCanvas.on('mouse:down', function(opt) {
  var evt = opt.e;
  if (evt.altKey === true) {
	this.isDragging = true;
	this.selection = false;
	this.lastPosX = evt.clientX;
	this.lastPosY = evt.clientY;
  }
  });
fabricCanvas.on('mouse:move', function(opt) {
  if (this.isDragging) {
	var e = opt.e;
	var vpt = this.viewportTransform;
	vpt[4] += e.clientX - this.lastPosX;
	vpt[5] += e.clientY - this.lastPosY;
	this.requestRenderAll();
	this.lastPosX = e.clientX;
	this.lastPosY = e.clientY;
  }
  });
fabricCanvas.on('mouse:up', function(opt) {
  // on mouse up we want to recalculate new interaction
  // for all objects, so we call setViewportTransform
  this.setViewportTransform(this.viewportTransform);
  this.isDragging = false;
  this.selection = true;
  });

var temp_color;

const canvasBackgroundUpdate = (currFrameData, inputType, image_url, scaling_factor_width, scaling_factor_height) => {
	console.log("updated canvas")
	  if(inputType == INPUT_IMAGE){ //This is for when images are uploaded
		  var img = new Image()
		  img.onload = function() {
			  fabricCanvas.clear()
			  if(currFrameData != undefined){
				  fabric.util.enlivenObjects(currFrameData, function (enlivenedObjects){
					  enlivenedObjects.forEach(function (obj, index) {
						  fabricCanvas.add(obj);
					  });
					  fabricCanvas.renderAll();
				  })
			  }
			  var f_img = new fabric.Image(img, {
				  objectCaching: false,
				  scaleX: scaling_factor_width / img.width,
				  scaleY: scaling_factor_height / img.height
			  });
			  fabricCanvas.setBackgroundImage(f_img);
			
			  fabricCanvas.renderAll();

		  };
		  img.src = URL.createObjectURL(image_url)
		  return;
	}
}

export default function FabricRender(props){
	console.log(props)
	useEffect(() => {
		var el = ReactDOM.findDOMNode(this);
		console.log(el)
		var htmlvideo = document.getElementsByTagName('canvas')[props.stream_num]
		fabricCanvas.initialize(htmlvideo, {
			height: props.scaling_factor_height,
		  	width: props.scaling_factor_width,
		  	backgroundColor : null,
		});
	}, []);

	
	var image_data = useSelector(state => state.media_data)
	console.log(image_data)
	image_data = image_data['data'][props.stream_num]

	var currframe_redux = useSelector(state => state.current_frame)['data']

	canvasBackgroundUpdate([], INPUT_IMAGE, image_data[currframe_redux], props.scaling_factor_width, props.scaling_factor_height)

	return(
		<div>
			<canvas id="canvas"></canvas>
		</div>
	)
}