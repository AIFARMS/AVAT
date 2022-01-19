//Core imports
import React, { useEffect, useState } from "react"; 
import ReactPlayer from 'react-player'
import 'bootstrap/dist/css/bootstrap.min.css';
//import fileMetadata from '../../processing/extract_framerate'

//UI Element imports
import Toast from 'react-bootstrap/Toast'

//Processing
import ExtractingAnnotation from '../../processing/annotation-processing'

//Annotations
import { BoundingBox } from '../../annotations/bounding_box'
import { KeyPoint } from '../../annotations/key_point'
import { Segmentation } from '../../annotations/segmentation'

//Column information + data structure
import {columns} from '../../static_data/columns'
//import {columns_LPS} from '../../static_data/columns'
import {ANNOTATION_FRAME, ANNOTATION_BBOX, ANNOTATION_KEYPOINT, ANNOTATION_SEG} from '../../static_data/constants'

//Components
import CustomNavBar from "../Components/nav_bar";
import FabricRender from "../Components/fabric_canvas";
import AnnotationTable from "../Components/change_table";

//TODO add local storage functionality to auto-save
if (typeof(Storage) === "undefined") {
  // Code for localStorage/sessionStorage.
  alert('Your browser does not support local storage. \nSome autosaving features of the app will not work as intended.\nPlease see the documentation to find supported browsers and their versions')
}

const fabric = require("fabric").fabric;

//TODO ADD DYNAMIC SOLUTION 
var frame_rate = 15;
var num_frames = -1;
var scaling_factor_width = 1920;
var scaling_factor_height = 1080;
var skip_value = 1;

//var current_screen_width = window.screen.width;
var current_screen_height = window.screen.height;

//Mappings are based off of https://en.wikipedia.org/wiki/List_of_common_resolutions make sure to use 1:1 and 16:9 aspect ratio
/*if (current_screen_height >= 1440){
  scaling_factor_width = 1920;
  scaling_factor_height = 1080;
}else */if(current_screen_height >= 1080){
  scaling_factor_width = 1280;
  scaling_factor_height = 720;
}else if(current_screen_height >= 1024){
  scaling_factor_width = 1152;
  scaling_factor_height = 648;
}else if(current_screen_height >= 768){
  scaling_factor_width = 1024;
  scaling_factor_height = 576;
}

// globally accessable fabricCanvas instance
var fabricCanvas = new fabric.Canvas('c', {
	uniScaleTransform: true,
	uniformScaling: false,
	includeDefaultValues: false
});



fabricCanvas.on('mouse:over', function(e) {
	if(e.target == null | segmentation_flag == true){
		return;
	}else if(e.target['_objects'] == undefined){
		return;
	}	
/* 	if(e.target['type'] !== 'rect' | e.target['type'] !== 'polygon'){
		return;
	} */
    temp_color = e.target['_objects'][0].get('fill')
	e.target['_objects'][0].set('fill', "#39FF14");
    fabricCanvas.renderAll();
});

fabricCanvas.on('mouse:out', function(e) {
	if(e.target == null | segmentation_flag == true){
		return;
	}else if(e.target['_objects'] == undefined){
		return;
	}
/* 	if(e.target['type'] !== 'rect' | e.target['type'] !== 'polygon'){
		return;
	} */
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
var video_width = 0;
var video_height = 0;
var frame_data = [[]];
var annotation_data = [[]];
var upload = false;
var disable_buttons = true;
var toast_text = ""
var ANNOTATOR_NAME = ""
var ANNOTATION_VIDEO_NAME = ""
var VIDEO_METADATA = {}
var play_button_text = "ERROR"
var temp_flag = false
var time_unix = 0;
var segmentation_flag = false;
var on_ready_flag = false;
var image_frames = []
var total_frames
var player_opacity = 0

function save_data(frame_num){
	//return; //TODO Clear up
	if(fabricCanvas.getObjects().length != 0){
		frame_data[frame_num] = fabricCanvas.getObjects()
	}else{
		frame_data[frame_num] = []
	}
}

function save_localstorage(){
	//console.log(frame_data)
	try{
		//localStorage.setItem('frame_data', JSON.stringify(frame_data))
		//localStorage.setItem('annotation_data', JSON.stringify(annotation_data))
	} catch (error){
		//console.log("Local storage failed!")
	}
}

var currentFrame = 0

//Current frame counter
export default function MainUpload() {
	const [visualToggle, setVisualToggle] = useState(0);
	const [annotationType, setAnnotationType] = useState("1")
	const [boxCount, setBoxCount] = useState(0)
	const [videoFilePath, setVideoFileURL] = useState(null);
	const [videoFilePath1, setVideoFileURL1] = useState(null);
	const [oldAnnotation, setOldAnnotation] = useState(null)
	const [player, setPlayer] = useState(null)
	const [duration, setDuration] = useState(0);
	const [show, setShow] = useState(false);
	const [save, changeSave] = useState(false);
	const [seeking, setSeeking] = useState(false)
	const [playing, setPlaying] = useState(false);
	const [keyCheck, changeKeyCheck] = useState(true)
	const [playbackRate, setPlaybackRate] = useState(1)
	const [inputType, setInputType] = useState(0)
	const [tableFrameNum, setTableFrameNum] = useState(0) //This var is to cause a slight delay to keep the table refresh happen at the same time of the frame change to not disrubt user **
	const [previousFrameNumber, setPreviousFrameNumber] = useState(0) 
	const [customColumns, setCustomColumns] = useState(columns)

	if(!segmentation_flag){
		fabricCanvas.forEachObject(object => {
			object.selectable = true
			object.evented = true;
		});
	}

	const handleInputType = (val) => {
		if(val == 0 | val ==1){
			setInputType(val)
			//alert("Input set to " + val)
		}else{
			alert("ERROR VALUE SET - Please report this bug!\n")
		}
	}

	const handleSetCurrentFrame = (val) => {
		total_frames = duration * frame_rate
		handle_visual_toggle()
		if(typeof(val) === "number"){

			currentFrame =(val)
			setVisualToggle(Math.floor(Math.random() * 999999999999))
			var new_skip = val/(total_frames)
			if(new_skip > duration){
				new_skip = duration
			}
			player.seekTo(new_skip)
		}else{
			save_data(currentFrame)
			var frame_calc = (val['played']/total_frames)
			frame_calc = (Math.floor(val['played']*total_frames))
			if((play_button_text === "Play" && temp_flag === true) | play_button_text === "Pause"){
				if(frame_calc >= total_frames){
					currentFrame =(total_frames-1)
					setVisualToggle(Math.floor(Math.random() * 999999999999))
					temp_flag = false;
					return;
				}
				currentFrame =(frame_calc)
				setVisualToggle(Math.floor(Math.random() * 999999999999))
				temp_flag = false;
			}
			if(play_button_text === "Pause"){
			}
			setVisualToggle(Math.floor(Math.random() * 999999999999))
		}
	}

	const removeRow = (index) => {	
		console.log(index)	
		var index_num = 1;
		for(var i = 0; i < annotation_data[currentFrame].length; i++){
			if(annotation_data[currentFrame][i]['id'] == index){
				index_num = i
				break;
			}
		}
		if (index_num === -1){
			alert("bug: " + index)
		}

		if(index.substring(index.length-1, index.length) !== "f"){ //Disabled removal of key-point for now
			var current_objects = fabricCanvas.getObjects()
			for(var i = 0; i < current_objects.length; i++){
				console.log(current_objects[i])
				if(current_objects[i]['_objects'][1]['text'] === index){
					console.log("REMOVED")
					fabricCanvas.remove(current_objects[i]);
					fabricCanvas.fire('saveData');
					fabricCanvas.renderAll();
					break;
				}
			}
		}
		console.log("CURRENT FRAME: " + currentFrame)
		var length_before = annotation_data[currentFrame].length
		annotation_data[currentFrame].splice(index_num, 1)
		if (annotation_data[currentFrame].length == length_before){
			alert("Delete error, please note this error down in the bug tracker - Size of array: " + annotation_data[currentFrame].length )
		}
		save_data(currentFrame)
	}

	const remove_table_index = (index) => {
		if (index === undefined) {
			var indiciesToDelete = []
			for(var i = 0; i < annotation_data[currentFrame].length; i++){
				indiciesToDelete.push(annotation_data[currentFrame][i]['id'])
			}
			indiciesToDelete.map(x => removeRow(x))
		}else{
			removeRow(index)
		}
		console.log(annotation_data[currentFrame])
		canvasBackgroundUpdate()
		//TODO make this more elegant - Currently makes a random number since the state change using an incremental update to the integer caused a stop of state updates and did not respond to any changes. This forces the values to be changed on random and should not have any dependence of the previous value of the visual toggle state.
		setVisualToggle(Math.floor(Math.random() * 999999999999))
	}
	
	

	const save_previous_data = () => {
		if(annotation_data[currentFrame].length == 0){
			return;
		}
		//console.log(frame_data[currentFrame])
		setPreviousFrameNumber(currentFrame)
	}

	const addToCanvas = () =>{
		var color = "#" + ((1<<24)*Math.random() | 0).toString(16)
		
		if(annotation_data[currentFrame] == null){
			annotation_data[currentFrame] = []
		}
		if (segmentation_flag == true){
			alert("Please finish your current segmentation!")
			return
		}
		
		var annotation_type_txt = "error"

		if (annotationType === ANNOTATION_BBOX){
			annotation_type_txt = "b"
			var new_bbox = new BoundingBox(fabricCanvas.height/2, fabricCanvas.width/2, 50, 50, color, boxCount+'b', "None").generate_no_behavior(fabricCanvas)
			//fabricCanvas.add(new_bbox)
		}else if (annotationType === ANNOTATION_KEYPOINT){
			//TODO fix KeyPoint
			alert("KeyPoint annotation are currently unavailable")
			annotation_type_txt = "k"
			//var keyp = new KeyPoint().generate_stick(fabricCanvas)
		}else if (annotationType === ANNOTATION_SEG){
			//TODO Fix segmentation issues
			annotation_type_txt = "s"	  

			var segment = new Segmentation().generate_polygon(fabricCanvas, boxCount+'s', toggle_segmentation)
			toggle_segmentation()

		}else if(annotationType === ANNOTATION_FRAME){
			//TODO Add annotation frame datapoint
			annotation_type_txt = "f"
		}

		if(inputType === 1){
			annotation_data[currentFrame].push({id: boxCount+annotation_type_txt, global_id: "",status: "", current: "", behavior: "", posture: "", notes: "", confidence:"", dataType: "image", fileName: image_frames[currentFrame]['name']})
		}else{
			annotation_data[currentFrame].push({id: boxCount+annotation_type_txt, global_id: "",status: "", current: "", behavior: "", posture: "", notes: "",  confidence:"", dataType: "video", fileName: "frame_"+currentFrame})
		}
    //annotation_data[currentFrame].push({id: boxCount+annotation_type_txt, global_id: -1,status: "", current: "", behavior: "", posture: "", notes: "", confidence: ""})
		save_data(currentFrame)
		setBoxCount(boxCount + 1);
		fabricCanvas.fire('saveData');
	}

	const toggle_segmentation = (event) => {
		segmentation_flag = !segmentation_flag
	}

	const handleVideoUpload = (event) => {
		if(inputType === 1){
			image_frames = event.target.files
			total_frames = image_frames.length
			for(var i = 0; i < total_frames; i++){
				annotation_data.push([])
			}
			canvasBackgroundUpdate() //TODO might cause a breaking change since no return
			disable_buttons = false;
		}
		
		if(typeof(event) === "string"){//Youtube upload
			setVideoFileURL(event)
			ANNOTATION_VIDEO_NAME = event
			upload = true;
			return;
		}
		if(inputType !== 1){
			//fileMetadata(event.target.files[0])
		}
		ANNOTATION_VIDEO_NAME = event.target.files[0]['name']
		setVideoFileURL(URL.createObjectURL(event.target.files[0]));
		upload = true;
	};

	//ASYNC Function  - To note that the data that comes out of this will be a bit delayed and this could cause some issues.
	const handleOldAnnotation = (event) => {
		var promise = downloadOldAnnotation(event)
		promise.then(function (result) {
			if(result != null){
				setOldAnnotation(new ExtractingAnnotation(result, fabricCanvas));
			}else{
				alert("Error in processing Annotation")
			}
		})
	}

	useEffect(() => {
		//TODO Find a more elegant solution. This is a temporay patch work.
		if(oldAnnotation == null){
			return;
		}
		frame_data = oldAnnotation.get_frame_data();
		annotation_data = oldAnnotation.get_annotation_data();
		handle_visual_toggle()
		canvasBackgroundUpdate()
	}, [oldAnnotation]);

	const downloadOldAnnotation = (file) => {
		return new Promise((resolve, reject) => {
		var reader = new FileReader();
		reader.onload = function(e) {
			resolve((JSON.parse(e.target.result)));
		}
		reader.readAsText(file.target.files[0])
		})
	}
  

	const handlePlaying = (event) => {
		if(play_button_text === "Pause"){
			temp_flag = true;
		}
		setPlaying(!playing)
		save_previous_data()
	}


	if(playing === true){
		play_button_text = "Pause"
		player_opacity = 100
	}else{
		play_button_text = "Play"
		player_opacity = 0
	}

	const handleSetPlayer = val => {
		if(val != null){
		if(val['player'] != null){
			if(val['player']['player'] != null){
					if(val['player']['player'] != null){
						video_width = val['player']['player']['player'].videoWidth
						video_height = val['player']['player']['player'].videoHeight
						var duration = val['player']['player']['player'].duration
						VIDEO_METADATA = {name: ANNOTATION_VIDEO_NAME, duration: duration, horizontal_res: video_width, vertical_res: video_height, frame_rate: frame_rate, time: time_unix}
					}
				}
			}
		}
		setPlayer(val)
	}

	const handleSetDuration = val => {
		if(upload === true && player != null){      
			num_frames = Math.round(val * frame_rate);

			if(annotation_data[0].length == 0){
				console.log("Resetting frame_data and annotation_data")
				frame_data = new Array(num_frames)
				annotation_data = new Array(num_frames)
				//TODO Update this later
				for (var i = 0; i < num_frames; i++){
					frame_data[i] = []
					annotation_data[i] = []
				}
			}

			//upload = false;
			disable_buttons = false
		}
		total_frames = parseInt(val) * frame_rate
		setDuration(parseInt(val))
	}

	const [scrubbing, setScrubbing] = useState(true);


	const skip_frame_forward = e =>{
		save_previous_data()
		var frameVal = currentFrame + skip_value
		if(frameVal >= total_frames){
			if(inputType === 1){
				currentFrame = (total_frames-1)
				setVisualToggle(Math.floor(Math.random() * 999999999999))
				return;
			}
			handleSetCurrentFrame(total_frames-1)
		}else{
			if(inputType === 1){
				currentFrame =(frameVal)
				setVisualToggle(Math.floor(Math.random() * 999999999999))
				return;
			}
			handleSetCurrentFrame(frameVal)
		}
	}

	const skip_frame_backward = e => {
		save_previous_data()

		var frameVal = currentFrame - skip_value
		if(frameVal < 0){
			if(inputType === 1){
				currentFrame =(0)
				setVisualToggle(Math.floor(Math.random() * 999999999999))
				return;
			}
			handleSetCurrentFrame(0)
		}else{
			if(inputType === 1){
				currentFrame =(frameVal)
				setVisualToggle(Math.floor(Math.random() * 999999999999))
				return;
			}
			handleSetCurrentFrame(frameVal)
		}
	}

	useEffect(() => {
		if(inputType === 1){
			canvasBackgroundUpdate()
		}else if(duration != 0){
			canvasBackgroundUpdate()
		}
	}, [currentFrame]);

	const change_skip_value = (event) => {
		skip_value = event
	}

	const change_annotation_type = (event) => {
		setAnnotationType(event)
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const onKeyPress = (event) =>{
		//Making sure input for textbox doesnt get counted as a mode change
		if(keyCheck === false){
			return;
		}
		if(segmentation_flag === true){
			alert("Please finish your current action!")
			return;
		}
		if (event.key === ANNOTATION_BBOX){
			toast_text = "Mode Switch: Bounding Box"
			changeSave(true)
			setAnnotationType(ANNOTATION_BBOX)
		}else if (event.key === ANNOTATION_KEYPOINT){
			toast_text = "Mode Switch: Key Point"
			changeSave(true)
			setAnnotationType(ANNOTATION_KEYPOINT)
		}else if(event.key === ANNOTATION_SEG) {
			toast_text = "Mode Switch: Segmentation"
			changeSave(true)
			setAnnotationType(ANNOTATION_SEG)
		}else if(event.key === ANNOTATION_FRAME){
			toast_text = "Mode Switch: Behavior Annotation"
			changeSave(true)
			setAnnotationType(ANNOTATION_FRAME)
		}else if (event.key === "a"){
			var annotext = ""
			if(annotationType === ANNOTATION_BBOX){
				annotext = "Bounding Box"
			}else if(annotationType === ANNOTATION_FRAME){
				annotext = "Behavior Data"
			}else if (annotationType === ANNOTATION_KEYPOINT){
				annotext = "Keypoint"
			}else if (annotationType === ANNOTATION_SEG){
				annotext = "Segmentation"
			}
			toast_text = "Added Annotation - " + annotext
			if(annotationType !== ANNOTATION_SEG){
				changeSave(true)
			}
			addToCanvas()
		}else if (event.key === "q"){
			save_localstorage()
			skip_frame_backward()
		}else if (event.key === "w"){
			canvasBackgroundUpdate()
			handlePlaying()
		}else if (event.key === "e"){
			save_localstorage()
			skip_frame_forward()
		}else if (event.key === "s"){
			toast_text = "Annotation Saved"
			changeSave(true)
			frame_data[currentFrame] = fabricCanvas.toJSON()
		}else if (event.key === "f"){
			if(scrubbing === false){
				toast_text = "Scrubbing Mode Activated"
				setScrubbing(true)
				changeSave(true)
			}else{
				toast_text = "Scrubbing Mode Deactivated"
				setScrubbing(false)
				changeSave(true)
			}
		}else if(event.key === "c"){
			toast_text = "Copying previous frame annotation"
			annotation_data[currentFrame] = JSON.parse(JSON.stringify(annotation_data[previousFrameNumber]))
			frame_data[currentFrame] = JSON.parse(JSON.stringify(frame_data[previousFrameNumber]))
			fabric.util.enlivenObjects(frame_data[currentFrame], function(objects) {		
				frame_data[currentFrame] = objects	
				for(var i = 0; i < objects.length; i++){
					frame_data[currentFrame][i]['local_id'] = frame_data[previousFrameNumber][i]['local_id']
				}
				//canvasBackgroundUpdate() //TODO Might run into performance issues. If performance issues persist, refine this approach.
				//changeSave(true)
			}); 
			/* for(var i = 0; i < frame_data[previousFrameNumber].length; i++){
				fabricCanvas.add(JSON.parse(JSON.stringify(frame_data[previousFrameNumber][i])))
			} */
			//save_data(currentFrame)
			changeSave(true)
			canvasBackgroundUpdate()
		}
	}  

	useEffect(() => {
		document.addEventListener("keydown", onKeyPress);
		return () => document.removeEventListener("keydown", onKeyPress);
	}, [onKeyPress]);
	


	const change_annotator_name = (event) => {
		ANNOTATOR_NAME = event
	}

	const handle_visual_toggle = () => {
		setVisualToggle(Math.floor(Math.random() * 999999999999))
	}

	const handleSetPlaybackRate = (playbackRate) => {
		if(isNaN(playbackRate)){
			setPlaybackRate(0)
		}else if(playbackRate > 16){
			alert("Max playback rate is 16!")
			setPlaybackRate(16)
		}	
		else{
			setPlaybackRate(playbackRate)
		}
	}

	const toggleKeyCheck = (toggle_val) => {
		console.log("Keycheck activated")
		if(toggle_val === undefined){
			changeKeyCheck(!keyCheck)
		}else{
			changeKeyCheck(toggle_val)
		}
	}

	const setFrameRate = (framerate) => {
		frame_rate = parseInt(framerate)
		if (frame_rate > 120){
			frame_rate = 120;
		}else if(frame_rate <= 0){
			frame_rate = 1;
		}else if(Number.isFinite(frame_rate) == false){
			frame_rate = 1;
			return;
		}

		num_frames = Math.round(duration * frame_rate);
		if(annotation_data[0].length == 0){
			total_frames = duration * framerate
			console.log("Resetting frame_data and annotation_data")
			frame_data = new Array(num_frames)
			annotation_data = new Array(num_frames)
			//TODO Update this later
			for (var i = 0; i < num_frames; i++){
				frame_data[i] = []
				annotation_data[i] = []
			}
			//TODO make this more elegant - Currently makes a random number since the state change using an incremental update to the integer caused a stop of state updates and did not respond to any changes. This forces the values to be changed on random and should not have any dependence of the previous value of the visual toggle state.
			setVisualToggle(Math.floor(Math.random() * 999999999999))

		}else{
			alert("There is data currently annotated! To change frame rate refresh the page and re-upload!")
		}
	}

	const setDateTime = (time) => {
		time_unix = time;
		VIDEO_METADATA = {name: ANNOTATION_VIDEO_NAME, duration: duration, horizontal_res: video_width, vertical_res: video_height, frame_rate: frame_rate, time: time_unix}
	}
 
	const canvasBackgroundUpdate = () => {
		console.log("updated canvas")
		if(inputType == 1){ //This is for when images are uploaded
			var img = new Image()
			img.onload = function() {
				fabricCanvas.clear()
				if(frame_data[currentFrame] != undefined){
					fabric.util.enlivenObjects(frame_data[currentFrame], function(objects) {		
						for(var i = 0; i < frame_data[currentFrame].length; i++){
							objects[i].local_id = frame_data[currentFrame][i].local_id
							fabricCanvas.add(objects[i])
						}
					}); 
				}
				VIDEO_METADATA = {name: ANNOTATION_VIDEO_NAME, duration: duration, horizontal_res: img.width, vertical_res: img.height, frame_rate: frame_rate, time: time_unix}
				var f_img = new fabric.Image(img, {
					objectCaching: false,
					scaleX: scaling_factor_width / img.width,
					scaleY: scaling_factor_height / img.height
				});
				console.log("CURRFRAME: " + currentFrame)
				fabricCanvas.setBackgroundImage(f_img);
			
				fabricCanvas.renderAll();
				//save_data()
				setTableFrameNum(currentFrame)
	
			};
			img.src = URL.createObjectURL(image_frames[currentFrame])
			return;
		}else if(inputType == 0){ //This is for when videos are uploaded
			//TODO cleanup variabkle
			var htmlvideo = document.getElementsByTagName('video')[0]
			let canvas = document.createElement('canvas');
			let context = canvas.getContext('2d');
			let [w, h] = [scaling_factor_width, scaling_factor_height]
			canvas.width =  scaling_factor_width;
			canvas.height = scaling_factor_height;
		
			context.drawImage(htmlvideo, 0, 0, w, h);
			let base64ImageData = canvas.toDataURL();

			var img = new Image()
			img.onload = function() {
				fabricCanvas.clear()
				if(frame_data[currentFrame] != undefined){
					for(var i = 0; i < frame_data[currentFrame].length; i++){
						fabricCanvas.add(frame_data[currentFrame][i])
					}
				}
				var f_img = new fabric.Image(img, {
					objectCaching: false
				});
			
				fabricCanvas.setBackgroundImage(f_img);
			
				fabricCanvas.renderAll();
				canvas.remove()
				//save_data()
				setTableFrameNum(currentFrame)

			};

			img.src = base64ImageData
		}
	}

	const handleOnReady = val => {
		//canvasBackgroundUpdate()
		if(on_ready_flag == false){
			canvasBackgroundUpdate()
			on_ready_flag = true
		}
	}

	return (
		<div>
			<CustomNavBar 
				disable_buttons={disable_buttons} 
				video_width={video_width} 
				video_height={video_height} 
				skip_value={skip_value} 
				ANNOTATOR_NAME={ANNOTATOR_NAME}
				handleOldAnnotation={handleOldAnnotation}
				handleVideoUpload={handleVideoUpload}
				currentFrame={currentFrame}
				display_frame_num={"Frame #" + parseInt(currentFrame+1)+' / '+parseInt(total_frames)}
				skip_frame_forward={skip_frame_forward}
				skip_frame_backward={skip_frame_backward}
				handlePlaying={handlePlaying}
				play_button_text={play_button_text}
				addToCanvas={addToCanvas}
				ANNOTATION_VIDEO_NAME={ANNOTATION_VIDEO_NAME}
				frame_data={frame_data}
				change_skip_value={change_skip_value}
				change_annotator_name={change_annotator_name}
				change_annotation_type={change_annotation_type}
				annotation_data={annotation_data}
				VIDEO_METADATA={VIDEO_METADATA}
				scaling_factor_height={scaling_factor_height}
				scaling_factor_width={scaling_factor_width}
				handleSetPlaybackRate={handleSetPlaybackRate}
				toggleKeyCheck={toggleKeyCheck}
				setFrameRate={setFrameRate}
				frame_rate={frame_rate}
				setDateTime={setDateTime}
				fabricCanvas={fabricCanvas}
				save_data={save_data}
				handle_visual_toggle={handle_visual_toggle}
				handleInputType={handleInputType}
				image_frames={image_frames}
				toggle_segmentation={toggle_segmentation}
			/>
			<Toast 
				onClose={() => changeSave(false)} 
				show={save} delay={500} autohide
				style={{ position: 'absolute', top: '100', left: '100', zIndex: '100'}}
			>
				<Toast.Header>
					<strong className="mr-auto">{toast_text}</strong>
				</Toast.Header>
			</Toast>
			{
				upload === true && 
				<div style={{display: "grid"}} show={upload}>
					<div style={{gridColumn: 1, gridRow:1, position: "relative", width: scaling_factor_width, height: scaling_factor_height, top: 0, left: 0, opacity: player_opacity}}>
						{
							inputType==0 && 
							<ReactPlayer 
								onReady={handleOnReady}
								ref={handleSetPlayer} 
								onDuration={handleSetDuration} 
								url={videoFilePath} 
								width='100%'
								height='100%'
								playing={playing} 
								controls={false} 
								style={{position:'absolute', float:'left', top:0, left:0}}
								volume={0}
								muted={true}
								pip={false}
								playbackRate={playbackRate}
								id="myvideo"
							/>
						}
					</div>
					<div style={{gridColumn: 1, gridRow:1, position: "relative",  top: 0, left: 0, opacity: 100-player_opacity}}>
						<FabricRender 
							fabricCanvas={fabricCanvas}
							currentFrame={currentFrame}
							save_data={save_data}
							scaling_factor_height={scaling_factor_height}
							scaling_factor_width={scaling_factor_width}
						/>
					</div>
					<div style={{gridColumn: 2, gridRow:1, position: "relative",width: scaling_factor_width*.4, height: scaling_factor_height, top: 0, left: 0}}>
						<AnnotationTable
							annotation_data={annotation_data}
							currentFrame={tableFrameNum}
							toggleKeyCheck={toggleKeyCheck}
							columns={columns}
							remove_table_index={remove_table_index}
							handleSetCurrentFrame={handleSetCurrentFrame}
						/>
					</div>
				</div>
			}
		</div>
	);
}


