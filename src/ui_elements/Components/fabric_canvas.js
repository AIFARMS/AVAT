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


var temp_color;

const canvasBackgroundUpdate = (currFrameData, inputType, image_url, scaling_factor_width, scaling_factor_height, fabricCanvas, curr_frame, video) => {
	
	if(inputType == INPUT_IMAGE){ //This is for when images are uploaded
		console.log("Redraw of canvas -- image")
		var img = new Image()
		img.onload = function() {
			fabricCanvas.clear()
			console.log(currFrameData)
			if(currFrameData != undefined){
				fabric.util.enlivenObjects(currFrameData, function (enlivenedObjects){
					enlivenedObjects.forEach(function (obj, index) {
						fabricCanvas.add(obj);
					});
					fabricCanvas.renderAll();
				})
			}
			console.log(fabricCanvas.getObjects())
			var f_img = new fabric.Image(img, {
				objectCaching: false,
				scaleX: scaling_factor_width / img.width,
				scaleY: scaling_factor_height / img.height
			});
			fabricCanvas.setBackgroundImage(f_img);
		
			fabricCanvas.renderAll();
			console.log("updated canvas")
		};
		img.src = URL.createObjectURL(image_url)
		return;
	}else{ //This is for videos
		console.log("Redraw of canvas -- video")
		var video = document.getElementsByTagName('video')[0];
		video.oncanplay = function(){
			var video_canvas = new fabric.Image(video, {
				scaleX: scaling_factor_width / video.width,
				scaleY: scaling_factor_height / video.height,
				objectCaching: false
			})
			fabricCanvas.setBackgroundImage(video_canvas)
			fabricCanvas.renderAll();
		}

		

		console.log(video)
		console.log(parseInt(90 * (curr_frame/3)))
		video.currentTime = parseInt(90 * ((curr_frame+1)/3))

		return;
	}
}

export default function FabricRender(props){
	const [fabricCanvas, setFabricCanvas] = useState(null)
	const [currindex, setCurrindex] = useState(0)
	const [upload, setUpload] = useState(false)

	useEffect(() => {

		var temp_fabricCanvas = (new fabric.Canvas('c', {
			uniScaleTransform: true,
			uniformScaling: false,
			includeDefaultValues: false
		}));

		fabric.Image.prototype.toObject = (function(toObject) {
			return function() {
				return fabric.util.object.extend(toObject.call(this), {
					src: this.toDataURL()
				});
			};
		})(fabric.Image.prototype.toObject);

		temp_fabricCanvas.on('mouse:wheel', function(opt) {
			var delta = opt.e.deltaY;
			var zoom = temp_fabricCanvas.getZoom();
			zoom *= 0.999 ** delta;
			if (zoom > 20) zoom = 20;
			if (zoom < 0.01) zoom = 0.01;
			temp_fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
			opt.e.preventDefault();
			opt.e.stopPropagation();
		});

		temp_fabricCanvas.on('mouse:down', function(opt) {
			var evt = opt.e;
			if (evt.altKey === true) {
				this.isDragging = true;
				this.selection = false;
				this.lastPosX = evt.clientX;
				this.lastPosY = evt.clientY;
			}
		});
		temp_fabricCanvas.on('mouse:move', function(opt) {
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
		temp_fabricCanvas.on('mouse:up', function(opt) {
			this.setViewportTransform(this.viewportTransform);
			this.isDragging = false;
			this.selection = true;
		});

		var el = ReactDOM.findDOMNode(this);
		console.log(el)
		var canvas_elem = document.getElementsByTagName('canvas')[props.stream_num*2]
		console.log(canvas_elem)
		temp_fabricCanvas.initialize(canvas_elem, {
			height: props.scaling_factor_height,
		  	width: props.scaling_factor_width,
		  	backgroundColor : null,
		});

		setFabricCanvas(temp_fabricCanvas)
	}, []);

	
	var image_data = useSelector(state => state.media_data)
	console.log(image_data)
	image_data = image_data['data'][props.stream_num]

	var currframe_redux = useSelector(state => state.current_frame)['data']

	useEffect(() => {
		if(fabricCanvas != null){
			updateFrameData(currindex, fabricCanvas.getObjects())
		}
		setCurrindex(currframe_redux)
	}, [currframe_redux])

	if(fabricCanvas != null && image_data != undefined){
		console.log(image_data)
		if(image_data.length > 0){
			if(upload === false){
				var video = document.getElementsByTagName('video')[0];
				var source = document.createElement('source');
				source.src = URL.createObjectURL(image_data[0])
				source.type = "video/mp4"
				video.appendChild(source)
				setUpload(true)
			}
			console.log("canvas update")
			canvasBackgroundUpdate(getFrameData(currframe_redux), INPUT_VIDEO, image_data[0], props.scaling_factor_width, props.scaling_factor_height, fabricCanvas, currframe_redux)
			//canvasBackgroundUpdate(getFrameData(currframe_redux), INPUT_IMAGE, image_data[currframe_redux], props.scaling_factor_width, props.scaling_factor_height, fabricCanvas)
		}
	}

	return(
		<div width={props.scaling_factor_width} height={props.scaling_factor_height} objectFit={"cover"}>
			<canvas id={props.stream_num}></canvas>
			<video width={props.scaling_factor_width} height={props.scaling_factor_height}></video>
		</div>
	)
}