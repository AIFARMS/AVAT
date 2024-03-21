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


const canvasBackgroundUpdate = (currFrameData, inputType, image_url, scaling_factor_width, scaling_factor_height, fabricCanvas, remove_obj=true) => {
	if(inputType == INPUT_IMAGE){ //This is for when images are uploaded
		var img = new Image()
		img.onload = function() {
			if (remove_obj){
				fabricCanvas.clear();
			}
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
	}else{ //This is for videos
		if (remove_obj){
			fabricCanvas.remove(...fabricCanvas.getObjects());
		}
		if(currFrameData != undefined){
			fabric.util.enlivenObjects(currFrameData, function (enlivenedObjects){
				enlivenedObjects.forEach(function (obj, index) {
					fabricCanvas.add(obj);
				});
				fabricCanvas.renderAll();
			})
		}
		fabricCanvas.renderAll();
	}
}

export default function FabricRender(props){
	const [fabricCanvas, setFabricCanvas] = useState(null)
	const [currindex, setCurrindex] = useState(0)
	const [upload, setUpload] = useState(false)
	const [frameToUpdate, setFrameToUpdate] = useState(0)
	const metadata_redux = useSelector(state => state.metadata)
	const frame_redux = useSelector(state => state.frame_data)
	const image_data_store = useSelector(state => state.media_data)
	const currFrame = useSelector(state => state.current_frame)
	const currframe_redux = currFrame['data']
	const play_redux = useSelector(state => state.play_status.play)
	const image_data = image_data_store['data'][props.stream_num]

	const save_data = (frame_number, reason) => {
		if(fabricCanvas){
			console.log('SAVING DATA FOR FRAME', frame_number, reason)
			updateFrameData(frame_number, fabricCanvas.getObjects())
		}
	}

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

		temp_fabricCanvas.on('object:moving', function (event) {
			this.objDrag = true;
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
            updateFrameData(currframe_redux, temp_fabricCanvas.getObjects())
            if(this.objDrag){
				this.objDrag = false;
			}
			this.setViewportTransform(this.viewportTransform);
			this.isDragging = false;
			this.selection = true;
		});

		var el = ReactDOM.findDOMNode(this);
		var canvas_elem = document.getElementsByTagName('canvas')[props.stream_num*2]
		temp_fabricCanvas.initialize(canvas_elem, {
			height: props.scaling_factor_height,
		  	width: props.scaling_factor_width,
		  	backgroundColor : null,
		});

		setFabricCanvas(temp_fabricCanvas)
	}, []);

	useEffect(() => {
		if(fabricCanvas){
			save_data(frameToUpdate, "frame_change")
			setFrameToUpdate(currframe_redux) 
			var video = document.getElementsByTagName('video')[props.stream_num]
			if(upload == true){
				video.currentTime = (video.duration * ((currframe_redux+1)/metadata_redux['total_frames']))			
			}
			if(metadata_redux['media_type'] == INPUT_VIDEO){
				canvasBackgroundUpdate(getFrameData(currframe_redux), INPUT_VIDEO, image_data[0], props.scaling_factor_width, props.scaling_factor_height, fabricCanvas)
			}else if (metadata_redux['media_type'] == INPUT_IMAGE){
				canvasBackgroundUpdate(getFrameData(currframe_redux), INPUT_IMAGE, image_data[currframe_redux], props.scaling_factor_width, props.scaling_factor_height, fabricCanvas)
			}
		}
	}, [currFrame])

	useEffect(() => {
		if (upload==false){
			return
		}
		var video = document.getElementsByTagName('video')[props.stream_num]
		if(play_redux){
			save_data(frameToUpdate, "play")
			video.play()
			fabric.util.requestAnimFrame(function renderLoop() {
				fabricCanvas.renderAll();
			  	fabric.util.requestAnimFrame(renderLoop);
			});
		}else{
			video.pause()
			let frame_number = Math.ceil((video.currentTime  / video.duration) * metadata_redux['total_frames'])
			console.log("FRAME NUMBER", frame_number)
			setCurrentFrame(frame_number)
		}
	}, [play_redux])


	useEffect(() => {
		// We want to redraw when a annotation is added or removed. Unfortunately this also causes a redraw when the current frame is changed.
		// This is not ideal, but it is a good enough solution for now. This should NOT save the data.

		if(fabricCanvas){
			canvasBackgroundUpdate(getFrameData(currframe_redux), metadata_redux['media_type'], image_data[currframe_redux], props.scaling_factor_width, props.scaling_factor_height, fabricCanvas)
		}
	}, [frame_redux])

	
	if(fabricCanvas != null && image_data != undefined && upload===false && play_redux===false){
		if(image_data.length > 0){
			if(metadata_redux['media_type'] == INPUT_VIDEO){
				var video = document.getElementsByTagName('video')[props.stream_num]
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
				video.oncanplaythrough = function(){
					if(upload === false){
						var new_vid = new fabric.Image(video, {
							objectCaching: false,
							scaleX: props.scaling_factor_width / video.videoWidth,
							scaleY: props.scaling_factor_height / video.videoHeight
						})
						video.width = video.videoWidth
						video.height = video.videoHeight
						fabricCanvas.setBackgroundImage(new_vid);
						fabricCanvas.renderAll();
					}
					setUpload(true)
				}
			}else if(metadata_redux['media_type'] == INPUT_IMAGE){
				canvasBackgroundUpdate(getFrameData(currframe_redux), INPUT_IMAGE, image_data[currframe_redux], props.scaling_factor_width, props.scaling_factor_height, fabricCanvas)
			}
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
		    //}
}
