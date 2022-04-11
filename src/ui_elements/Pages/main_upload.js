//Core imports
import React, { useEffect, useState } from "react"; 
import ReactPlayer from 'react-player'
import 'bootstrap/dist/css/bootstrap.min.css';

//Constants
import {INPUT_IMAGE, INPUT_VIDEO} from '../../static_data/const'

//UI Element imports
import Toast from 'react-bootstrap/Toast'

//Processing
import ExtractingAnnotation from '../../processing/annotation-processing'

//Annotations
import { BoundingBox } from '../../annotations/bounding_box'
import { Segmentation } from '../../annotations/segmentation'

//Column information + data structure
import {columns} from '../../static_data/columns'
import {ANNOTATION_FRAME, ANNOTATION_BBOX, ANNOTATION_KEYPOINT, ANNOTATION_SEG} from '../../static_data/constants'

//Components
import CustomNavBar from "../Components/nav_bar";
import FabricRender from "../Components/fabric_canvas";
import AnnotationTable from "../Components/change_table";


//Redux
import store from '../../store' 
import {initFrameData, updateFrameData, getFrameData, 
		initAnnotationData, updateAnnotationData, getAnnotationData, 
		initColumnData, getColumnData, 
		initCurrentFrame, getCurrentFrame, setCurrentFrame,} from '../../processing/actions'
import { useSelector } from "react-redux";

const fabric = require("fabric").fabric;

//TODO ADD DYNAMIC SOLUTION 
var frame_rate = 15;
var num_frames = -1;
var scaling_factor_width = 1920;
var scaling_factor_height = 1080;
var skip_value = 1;

//var current_screen_width = window.screen.width;
var current_screen_height = window.screen.height;

if(current_screen_height >= 1080){////Mappings are based off of https://en.wikipedia.org/wiki/List_of_common_resolutions make sure to use 1:1 and 16:9 aspect ratio
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
var upload = false;
var disable_buttons = true;
var toast_text = ""
var ANNOTATION_VIDEO_NAME = ""
var VIDEO_METADATA = {}
var play_button_text = "ERROR"
var segmentation_flag = false;
var on_ready_flag = false;
var image_frames = []
var total_frames
var player_opacity = 0

//TODO remove after fixing null exceptions
initAnnotationData(1)
initFrameData(1)
initCurrentFrame(0)

//Current frame counter
export default function MainUpload() {
	const [visualToggle, setVisualToggle] = useState(0);
	const [annotationType, setAnnotationType] = useState("1")
	const [boxCount, setBoxCount] = useState(0)
	const [videoFilePath, setVideoFileURL] = useState(null);
	const [oldAnnotation, setOldAnnotation] = useState(null)
	const [player, setPlayer] = useState(null)
	const [duration, setDuration] = useState(0);
	const [save, changeSave] = useState(false);
	const [playing, setPlaying] = useState(false);
	const [keyCheck, changeKeyCheck] = useState(true)
	const [playbackRate, setPlaybackRate] = useState(1)
	const [inputType, setInputType] = useState(INPUT_VIDEO)
	const [tableFrameNum, setTableFrameNum] = useState(0) //This var is to cause a slight delay to keep the table refresh happen at the same time of the frame change to not disrubt user **
	const [previousFrameNumber, setPreviousFrameNumber] = useState(0) 
	const [isLoading, setIsLoading] = useState(true)

	//New state vars
	const [currFrameData, setCurrFrameData] = useState([])
	const [currAnnotationData, setCurrAnnotationData] = useState([])

	const annot_redux = useSelector(state => state.annotation_data.data)
	const column_redux = useSelector(state => state.column_annot.data)
	const currframe_redux = useSelector(state => state.current_frame)['data']
	console.log(currframe_redux)
	
	console.log(inputType)
	if(inputType == INPUT_IMAGE){
		total_frames = image_frames.length
	}
 
	console.log(fabricCanvas.getObjects())

	const save_data = (frame_num) => {
		console.log(frame_num)
		//return; //TODO Clear up
		console.log("Saved data")
		console.log(currAnnotationData)
		if(fabricCanvas.getObjects().length != 0){
			updateFrameData(frame_num, fabricCanvas.getObjects())
		}else{
			updateFrameData(frame_num, [])
		}
		updateAnnotationData(frame_num, currAnnotationData)
	}

	const handleInputType = (val) => {
		if(val == INPUT_VIDEO | val == INPUT_IMAGE){
			setInputType(val)
		}else{
			alert("ERROR VALUE SET - Please report this bug!\n")
		}
	}

	const removeRow = (index) => {
		console.log(index)
		var index_num = 1;
		for(var i = 0; i < currAnnotationData.length; i++){
			if(currAnnotationData[i]['id'] == index){
				index_num = i
				break;
			}
		}
		if (index_num === -1){
			alert("bug: " + index)
		}
		if(index.substring(index.length-1, index.length) !== "f"){ //Disabled removal of key-point for now
			var current_objects = fabricCanvas.getObjects()
			console.log(current_objects)
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
		var temp_array = [...currAnnotationData]; temp_array.splice(index_num, 1);
		setCurrAnnotationData(temp_array);
		//var temp_frame = [...currFrameData]; temp_frame.splice(index_num, 1);
		setCurrFrameData(fabricCanvas.getObjects())
		save_data(currframe_redux)
	}

	const remove_table_index = (index) => {
		if (index === undefined) {
			var indiciesToDelete = []
			for(var i = 0; i < currAnnotationData.length; i++){
				indiciesToDelete.push(currAnnotationData[i]['id'])
			}
			indiciesToDelete.map(x => removeRow(x))
		}else{
			removeRow(index)
		}
		console.log(currAnnotationData)
		setVisualToggle(Math.floor(Math.random() * 999999999999))
	}
	
	

	const save_previous_data = () => {
		if(currAnnotationData.length == 0){
			return;
		}
		setPreviousFrameNumber(currframe_redux)
	}

	const addToCanvas = () => {
		var color = "#" + ((1<<24)*Math.random() | 0).toString(16)
		
		if(currAnnotationData == null){
			setCurrAnnotationData([])
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
			annotation_type_txt = "s";
			alert("Segmentation has been disabled for this version. Please use an earlier version.");
			return;
			var segment = new Segmentation().generate_polygon(fabricCanvas, boxCount+'s', toggle_segmentation)
			toggle_segmentation()

		}else if(annotationType === ANNOTATION_FRAME){
			//TODO Add annotation frame datapoint
			annotation_type_txt = "f"
		}
		
		var saved_annot = getAnnotationData(getCurrentFrame())
		var generated_annotation;
		if(inputType === INPUT_IMAGE){
			generated_annotation = create_annotation(boxCount+annotation_type_txt)
		}else{
			generated_annotation = create_annotation(boxCount+annotation_type_txt)
		}
		saved_annot = Object.assign([], saved_annot)
		saved_annot.push(generated_annotation)
		updateAnnotationData(currframe_redux, saved_annot)
		updateFrameData(currframe_redux, fabricCanvas.getObjects())

		setBoxCount(boxCount + 1);
		fabricCanvas.fire('saveData');
	}

	useEffect(() =>{
		if(upload == true){
			setCurrAnnotationData(getAnnotationData(currframe_redux))
		}
	}, [annot_redux])

	const create_annotation = (id) => {
		var columns = getColumnData()
		var new_data = {}
		columns = columns['data']['columns']['columns']
		for(var i = 0; i < columns.length; i++){
			var curr_val = columns[i]
			new_data[curr_val.accessor] = ""
		}
		if(inputType === INPUT_IMAGE){
			new_data['dataType'] = "image"
			new_data['fileName'] = image_frames[currframe_redux]['name']
		}else{
			new_data['dataType'] = "video"
			new_data['fileName'] = "frame_" + currframe_redux
		}
		new_data['id'] = id
		return new_data
	}

	const toggle_segmentation = (event) => {
		segmentation_flag = !segmentation_flag
	}

	const handleVideoUpload = (event) => {
		console.log("UPLOADED " + inputType)
		if(inputType === INPUT_IMAGE){
			image_frames = event.target.files
			total_frames = image_frames.length
			initAnnotationData(image_frames.length)
			initFrameData(image_frames.length)
			disable_buttons = false;
			canvasBackgroundUpdate()
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
		store.dispatch({
			type: "frame_data/initOldAnnotation",
			payload: oldAnnotation.get_frame_data()
		});
		store.dispatch({
			type: "annotation_data/initOldAnnotation",
			payload: oldAnnotation.get_annotation_data()
		});

		setCurrFrameData(oldAnnotation.get_frame_data()[0])
		setCurrAnnotationData(oldAnnotation.get_annotation_data()[0])
		setBoxCount(oldAnnotation.find_highest_localid())
	}, [oldAnnotation]);
		

	useEffect(() =>{
		if(image_frames.length != 0){
			canvasBackgroundUpdate()
		}
		//updateFrameData(currframe_redux, currFrameData)
		//updateAnnotationData(currframe_redux, currAnnotationData)
		
	}, [currFrameData])

	useEffect(() => { //This shold update the view upon column loading
		setIsLoading(false)
	}, [column_redux])


	const downloadOldAnnotation = (file) => {
		return new Promise((resolve, reject) => {
		var reader = new FileReader();
		reader.onload = function(e) {
			resolve((JSON.parse(e.target.result)));
		}
		reader.readAsText(file.target.files[0])
		})
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
						VIDEO_METADATA = {name: ANNOTATION_VIDEO_NAME, duration: duration, horizontal_res: video_width, vertical_res: video_height, frame_rate: frame_rate}
					}
				}
			}
		}
		setPlayer(val)
	}

	const handleSetDuration = val => {
		if(upload === true && player != null){      
			num_frames = Math.round(val * frame_rate);

			if(currAnnotationData.length == 0){
				console.log("Resetting frame_data and annotation_data")
				initFrameData(num_frames)
				initAnnotationData(num_frames)
			}

			//upload = false;
			disable_buttons = false
		}
		total_frames = parseInt(val) * frame_rate
		setDuration(parseInt(val))
	}

	const skip_frame_forward = e =>{
		save_previous_data()
		save_data(currframe_redux)
		var frameVal = currframe_redux + skip_value
		console.log(frameVal)

		if(frameVal >= total_frames){
			if(inputType === INPUT_IMAGE){
				setCurrFrameData(getFrameData(total_frames-1))
				setCurrAnnotationData(getAnnotationData(total_frames-1))
				setCurrentFrame(total_frames-1)
				return;
			}
			setCurrFrameData(getFrameData(total_frames-1))
			setCurrAnnotationData(getAnnotationData(total_frames-1))
			setCurrentFrame(total_frames-1)
		}else{
			if(inputType === INPUT_IMAGE){
				setCurrFrameData(getFrameData(frameVal))
				setCurrAnnotationData(getAnnotationData(frameVal))
				setCurrentFrame(frameVal)
				return;
			}
			setCurrFrameData(getFrameData(frameVal))
			setCurrAnnotationData(getAnnotationData(frameVal))
			setCurrentFrame(frameVal)
		}
	}

	const skip_frame_backward = e => {
		save_previous_data()
		save_data(currframe_redux)
		var frameVal = currframe_redux - skip_value
		if(frameVal < 0){
			if(inputType === INPUT_IMAGE){
				setCurrFrameData(getFrameData(0))
				setCurrAnnotationData(getAnnotationData(0))
				setCurrentFrame(0)
				return;
			}
			setCurrFrameData(getFrameData(0))
			setCurrAnnotationData(getAnnotationData(0))
			setCurrentFrame(0)
		}else{
			if(inputType === INPUT_IMAGE){
				setCurrFrameData(getFrameData(frameVal))
				setCurrAnnotationData(getAnnotationData(frameVal))
				setCurrentFrame(frameVal)
				return;
			}
			setCurrFrameData(getFrameData(frameVal))
			setCurrAnnotationData(getAnnotationData(frameVal))
			setCurrentFrame(frameVal)
		}
	}

	useEffect(() => {
		if(inputType === INPUT_IMAGE){
			canvasBackgroundUpdate()
			total_frames = image_frames.length
		}else if(duration != 0){
			canvasBackgroundUpdate()
		}
	}, [currframe_redux]);

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
			skip_frame_backward()
		}else if (event.key === "w"){
			canvasBackgroundUpdate()
			alert("Video is currently under development, please use images for now!")
		}else if (event.key === "e"){
			skip_frame_forward()
		}else if(event.key === "c"){
			toast_text = "Copying previous frame annotation"
			setCurrAnnotationData(JSON.parse(JSON.stringify(getAnnotationData(previousFrameNumber))))

			var previous_frame_data = getFrameData(previousFrameNumber);
			fabric.util.enlivenObjects(previous_frame_data, function(objects) {		
				for(var i = 0; i < objects.length; i++){
					objects[i]['local_id'] = previous_frame_data[i]['local_id']
					fabricCanvas.add(objects[i])
				}
				setCurrFrameData(objects)
			}); 
			/* for(var i = 0; i < frame_data[previousFrameNumber].length; i++){
				fabricCanvas.add(JSON.parse(JSON.stringify(frame_data[previousFrameNumber][i])))
			} */
			changeSave(true)
		}
	}  

	useEffect(() => {
		document.addEventListener("keydown", onKeyPress);
		return () => document.removeEventListener("keydown", onKeyPress);
	}, [onKeyPress]);
	

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
		if(currAnnotationData.length == 0){
			total_frames = duration * framerate
			console.log("Resetting frame_data and annotation_data")
			
			initFrameData(num_frames)
			initAnnotationData(num_frames)

		}else{
			alert("There is data currently annotated! To change frame rate refresh the page and re-upload!")
		}
	}

	const canvasBackgroundUpdate = () => {
		console.log("updated canvas")
		if(inputType == INPUT_IMAGE){ //This is for when images are uploaded
			console.log(currFrameData)
			var img = new Image()
			img.onload = function() {
				fabricCanvas.clear()
				if(currFrameData != undefined){
					/*for(var i = 0; i < currFrameData.length; i++){
						console.log(currFrameData[i])
						fabricCanvas.add(currFrameData[i])
					}*/
					fabric.util.enlivenObjects(currFrameData, function (enlivenedObjects){
						enlivenedObjects.forEach(function (obj, index) {
							fabricCanvas.add(obj);
						});
						fabricCanvas.renderAll();
					})
				}
				VIDEO_METADATA = {name: ANNOTATION_VIDEO_NAME, duration: duration, horizontal_res: img.width, vertical_res: img.height, frame_rate: frame_rate}
				var f_img = new fabric.Image(img, {
					objectCaching: false,
					scaleX: scaling_factor_width / img.width,
					scaleY: scaling_factor_height / img.height
				});
				console.log("CURRFRAME: " + currframe_redux)
				fabricCanvas.setBackgroundImage(f_img);
			
				fabricCanvas.renderAll();
				setTableFrameNum(currframe_redux)
	
			};
			img.src = URL.createObjectURL(image_frames[currframe_redux])
			return;
		}else if(inputType == INPUT_VIDEO){ //This is for when videos are uploaded
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
				canvas.remove()
				setTableFrameNum(currframe_redux)

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

	const handleChangeAnnot = val => {
		setCurrAnnotationData(val)
	}

	return (
		<div>
			<CustomNavBar 
				disable_buttons={disable_buttons} 
				video_width={video_width} 
				video_height={video_height} 
				skip_value={skip_value} 
				handleOldAnnotation={handleOldAnnotation}
				handleVideoUpload={handleVideoUpload}
				currentFrame={currframe_redux}
				display_frame_num={"Frame #" + parseInt(currframe_redux+1)+' / '+parseInt(total_frames)}
				skip_frame_forward={skip_frame_forward}
				skip_frame_backward={skip_frame_backward}
				play_button_text={play_button_text}
				addToCanvas={addToCanvas}
				ANNOTATION_VIDEO_NAME={ANNOTATION_VIDEO_NAME}
				change_skip_value={change_skip_value}
				change_annotation_type={change_annotation_type}
				VIDEO_METADATA={VIDEO_METADATA}
				handleSetPlaybackRate={handleSetPlaybackRate}
				toggleKeyCheck={toggleKeyCheck}
				setFrameRate={setFrameRate}
				frame_rate={frame_rate}
				fabricCanvas={fabricCanvas}
				save_data={save_data}
				handle_visual_toggle={handle_visual_toggle}
				handleInputType={handleInputType}
				image_frames={image_frames}
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
				<div style={{display: "grid"}}>
					<div style={{gridColumn: 1, gridRow:1, position: "relative", width: scaling_factor_width, height: scaling_factor_height, top: 0, left: 0, opacity: player_opacity}}>

					</div>
					<div style={{gridColumn: 1, gridRow:1, position: "relative",  top: 0, left: 0, opacity: 100-player_opacity}}>
						<FabricRender 
							fabricCanvas={fabricCanvas}
							currframe_redux={currframe_redux}
							save_data={save_data}
							scaling_factor_height={scaling_factor_height}
							scaling_factor_width={scaling_factor_width}
						/>
					</div>
					<div style={{gridColumn: 2, gridRow:1, position: "relative",width: scaling_factor_width*.4, height: scaling_factor_height, top: 0, left: 0}}>
						<AnnotationTable
							annotation_data={currAnnotationData}
							change_annotation_data={handleChangeAnnot}
							currentFrame={currframe_redux}
							toggleKeyCheck={toggleKeyCheck}
							columns={columns}
							remove_table_index={remove_table_index}
						/>
					</div>
				</div>
			}
			{
				upload === false &&
				<div>
					"Video/Image upload not detected. Please upload."
				</div>
			}
		</div>
	);
}