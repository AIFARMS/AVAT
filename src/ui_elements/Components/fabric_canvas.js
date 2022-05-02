import React, { useEffect, useState } from "react"; 
import ReactDOM from 'react-dom'

import store from '../../store' 
import {initFrameData, updateFrameData, getFrameData, 
		initAnnotationData, updateAnnotationData, getAnnotationData, 
		initColumnData, getColumnData, 
		initCurrentFrame, getCurrentFrame, setCurrentFrame, setTotalFrames,} from '../../processing/actions'
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
		
		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');
		let [w, h] = [scaling_factor_width, scaling_factor_height]
		canvas.width =  scaling_factor_width;
		canvas.height = scaling_factor_height;
	
		context.drawImage(video, 0, 0, w, h);
		let base64ImageData = canvas.toDataURL();

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
			canvas.remove()
			console.log("updated canvas")
		};

		img.src = base64ImageData
		return;
	}
}

export default function FabricRender(props){
	const [fabricCanvas, setFabricCanvas] = useState(null)
	const [currindex, setCurrindex] = useState(0)
	const [upload, setUpload] = useState(false)
	const metadata_redux = useSelector(state => state.metadata)

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
		var video = document.getElementsByTagName('video')[props.stream_num]
		if(upload == true){
			video.currentTime = (video.duration * ((currframe_redux+1)/metadata_redux['total_frames']))
		}
	}, [currframe_redux])

	if(fabricCanvas != null && image_data != undefined){
		console.log(image_data)
		if(image_data.length > 0){
			if(metadata_redux['media_type'] == INPUT_VIDEO){
				var video = document.getElementsByTagName('video')[props.stream_num]
				if(upload === false){
					var source = document.createElement('source');
					source.src = URL.createObjectURL(image_data[0])
					source.type = "video/mp4"
					video.appendChild(source)
					video.onloadedmetadata = function(){
						initAnnotationData(parseInt(video.duration))
						initFrameData(parseInt(video.duration))
						setTotalFrames(parseInt(video.duration))
						video.currentTime=0
					}
					video.oncanplay = function(){
						canvasBackgroundUpdate(getFrameData(currframe_redux), INPUT_VIDEO, image_data[0], props.scaling_factor_width, props.scaling_factor_height, fabricCanvas, currframe_redux, video)
					}
					setUpload(true)
				}
			}else if(metadata_redux['media_type'] == INPUT_IMAGE){
				canvasBackgroundUpdate(getFrameData(currframe_redux), INPUT_IMAGE, image_data[currframe_redux], props.scaling_factor_width, props.scaling_factor_height, fabricCanvas)
			}
			//canvasBackgroundUpdate(getFrameData(currframe_redux), INPUT_VIDEO, image_data[0], props.scaling_factor_width, props.scaling_factor_height, fabricCanvas, currframe_redux)
		}
	}

	return(
		<div style={{display: "grid"}}>		
			<div style={{gridColumn: 1, gridRow:1, position: "relative", width: props.scaling_factor_width, height: props.scaling_factor_height, top: 0, left: 0, opacity: 0}}>
				<video></video>
			</div>
			<div style={{gridColumn: 1, gridRow:1, position: "relative",  top: 0, left: 0}}>
				<canvas id={props.stream_num}></canvas>
			</div>
		</div>
	)
}