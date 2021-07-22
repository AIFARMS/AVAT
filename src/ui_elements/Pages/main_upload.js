//Core imports
import React, { useEffect, useState } from "react"; 
import ReactDOM from 'react-dom'
import ReactPlayer from 'react-player'
import 'bootstrap/dist/css/bootstrap.min.css';

//UI Element imports
import Toast from 'react-bootstrap/Toast'
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed'

//Processing
import ExtractingAnnotation from '../../processing/annotation-processing'
import {video_to_img} from '../../processing/frame_extract'

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

console.log(window.screen.width)
console.log(window.screen.height)

var current_screen_width = window.screen.width;
var current_screen_height = window.screen.height;

//Mappings are based off of https://en.wikipedia.org/wiki/List_of_common_resolutions make sure to use 1:1 and 16:9 aspect ratio
if (current_screen_height >= 1440){
  scaling_factor_width = 1920;
  scaling_factor_height = 1080;
}else if(current_screen_height >= 1080){
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
var fabricCanvas = new fabric.Canvas('c', {uniScaleTransform: true});

var video_width = 0;
var video_height = 0;
var frame_data = [[]];
var annotation_data = [[]];
var upload = false;
var disable_buttons = true;
var sliderPercent = 0
var toast_text = ""
var previous_annotation = []
var previous_canvas_annotation = []
var ANNOTATOR_NAME = ""
var ANNOTATION_VIDEO_NAME = ""
var VIDEO_METADATA = {}
var play_button_text = "ERROR"
var temp_flag = false
var time_unix = 0;


function save_data(frame_num){
  frame_data[frame_num] = fabricCanvas.toJSON()
  console.log("SAVED")
}


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
	const [currentFrame, setCurrentFrame] = useState(0)
	const [keyCheck, changeKeyCheck] = useState(true)
	const [playbackRate, setPlaybackRate] = useState(1)

	

	const handleSetCurrentFrame = (val) => {
		var total_frames = duration * frame_rate
		if(typeof(val) === "number"){
			setCurrentFrame(val)
			player.seekTo(val/(total_frames))
		}else{
			console.log(val['played'])
			save_data(currentFrame)
			var frame_calc = (val['played']/total_frames)
			frame_calc = (Math.floor(val['played']*total_frames))
			if((play_button_text === "Play" && temp_flag === true) | play_button_text === "Pause"){
				setCurrentFrame(frame_calc)
				temp_flag = false;
			}
		}
	}

	const removeRow = (index) => {
		console.log(index)
		var index_num = 0;

		for(var i = 0; i < annotation_data[currentFrame].length; i++){
			if(annotation_data[currentFrame][i]['id'] == index){
				index_num = i
				break;
			}
		}

		if(index.substring(index.length-1, index.length) !== "f"){
			for(var i = 0; i < fabricCanvas.getObjects().length; i++){
				if(fabricCanvas.getObjects()[i]['_objects'][1]['text'] === index){
					fabricCanvas.remove(fabricCanvas.getObjects()[i]);
					fabricCanvas.fire('saveData');
					break;
				}
			}
		}
		annotation_data[currentFrame].splice(index_num, 1)
		save_data(currentFrame)
		
	}

	const remove_table_index = (index) => {
		console.log(index)
		if (index === undefined) {
			console.log(annotation_data[currentFrame].length)
			var indiciesToDelete = []
			for(var i = 0; i < annotation_data[currentFrame].length; i++){
				indiciesToDelete.push(annotation_data[currentFrame][i]['id'])
			}
			console.log(indiciesToDelete)
			indiciesToDelete.map(x => removeRow(x))
			
			console.log(annotation_data[currentFrame].length)
		}else{
			removeRow(index)
		}
		//TODO make this more elegant - Currently makes a random number since the state change using an incremental update to the integer caused a stop of state updates and did not respond to any changes. This forces the values to be changed on random and should not have any dependence of the previous value of the visual toggle state.
		setVisualToggle(Math.floor(Math.random() * 999999999999))
	}
	
	

	const save_previous_data = () => {
		if(annotation_data[currentFrame].length == 0){
			return;
		}
		previous_annotation = annotation_data[currentFrame]
		previous_canvas_annotation = frame_data[currentFrame]
	}

	const addToCanvas = () =>{
		var color = "#" + ((1<<24)*Math.random() | 0).toString(16)
		
		if(annotation_data[currentFrame] == null){
			annotation_data[currentFrame] = []
		}
		
		var annotation_type_txt = "error"

		if (annotationType === ANNOTATION_BBOX){
			annotation_type_txt = "b"
		var new_bbox = new BoundingBox(fabricCanvas.height/2, fabricCanvas.width/2, 50, 50, color, boxCount+'b', "None").generate_no_behavior(fabricCanvas)
			fabricCanvas.add(new_bbox)
		}else if (annotationType === ANNOTATION_KEYPOINT){
			//TODO fix KeyPoint
			alert("KeyPoint annotation are currently unavailable")
			annotation_type_txt = "k"
			//var keyp = new KeyPoint().generate_stick(fabricCanvas)
		}else if (annotationType === ANNOTATION_SEG){
			alert("Segmentation annotation is currently under development")
			//TODO Fix segmentation issues
			annotation_type_txt = "s"	  
			//var segment = new Segmentation().generate_polygon(fabricCanvas, boxCount+'s')
		}else if(annotationType === ANNOTATION_FRAME){
			//TODO Add annotation frame datapoint
			annotation_type_txt = "f"
		}
		annotation_data[currentFrame].push({id: boxCount+annotation_type_txt, global_id: -1,status: "", current: "", behavior: "", posture: "", notes: ""})
		console.log(annotation_data[currentFrame])
		save_data(currentFrame)
		setBoxCount(boxCount + 1);
		fabricCanvas.fire('saveData');
	}

	const handleVideoUpload = (event) => {
		console.log(typeof(event))
		if(typeof(event) === "string"){
			setVideoFileURL(event)
			ANNOTATION_VIDEO_NAME = event
			upload = true;
			return;
		}
		setVideoFileURL(URL.createObjectURL(event.target.files[0]));
		video_to_img(event.target.files[0], fabricCanvas)
		ANNOTATION_VIDEO_NAME = event.target.files[0]['name']
		upload = true;
	};

	//ASYNC Function  - To note that the data that comes out of this will be a bit delayed and this could cause some issues.
	const handleOldAnnotation = (event) => {
		var promise = downloadOldAnnotation(event)
		promise.then(function (result) {
			if(result != null){
				setOldAnnotation(new ExtractingAnnotation(result));
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
	}, oldAnnotation);

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
		//if(window.confirm("Are you sure you want to use the play/pause functionality?\n It is currenlty under development and WILL have unintentional bugs and glitches. \nReload the page if any issues arise") === true && play_button_text === "Play"){
		//}
		if(play_button_text === "Pause"){
			temp_flag = true;
		}
		setPlaying(!playing)
		save_previous_data()
	}


	if(playing === true){
		play_button_text = "Pause"
	}else{
		play_button_text = "Play"
	}

	const handleSeekChange = e => {
		sliderPercent = (parseFloat(e.target.value))
		console.log(sliderPercent)
	}

	const handleSeekMouseDown = e => {
		setSeeking(true)
	}

	const handleSeekMouseUp = e => {
		setSeeking(false)
		player.seekTo(parseFloat(e.target.value))
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

			frame_data = new Array(num_frames)
			annotation_data = new Array(num_frames)

			//TODO Update this later
			for (var i = 0; i < num_frames; i++){
				frame_data[i] = []
				annotation_data[i] = []
			}
			//upload = false;
			disable_buttons = false
		}
		setDuration(parseInt(val))
	}

	const [scrubbing, setScrubbing] = useState(true);

	const skip_frame_forward = e =>{
		save_previous_data()
		if(scrubbing === false){
			if (annotation_data[currentFrame+skip_value].length === 0){
				annotation_data[currentFrame+skip_value] = JSON.parse(JSON.stringify(annotation_data[currentFrame]));
				frame_data[currentFrame+skip_value] = frame_data[currentFrame];
			}
		}

		var total_frames = duration * frame_rate
		//player.seekTo((((player.getCurrentTime()/duration)*total_frames))/(total_frames) + (skip_value/total_frames))

		var frameVal = currentFrame + skip_value
		handleSetCurrentFrame(frameVal)
	}

	const skip_frame_backward = e => {
		save_previous_data()
		var total_frames = duration * frame_rate

		var frameVal = currentFrame - skip_value
		if(frameVal < 0){
			handleSetCurrentFrame(0)
		}else{
			handleSetCurrentFrame(frameVal)
		}
		//player.seekTo((frameVal/total_frames) * duration)
		//player.seekTo((((player.getCurrentTime()/duration)*total_frames))/(total_frames) - (skip_value/total_frames))
	}

	const change_skip_value = (event) => {
		skip_value = event
	}

	const change_annotation_type = (event) => {
		console.log(event)
		setAnnotationType(event)
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const onKeyPress = (event) =>{
		//Making sure input for textbox doesnt get counted as a mode change
		if(keyCheck === false){
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
			changeSave(true)
			addToCanvas()
		}else if (event.key === "q"){
			skip_frame_backward()
		}else if (event.key === "w"){
			handlePlaying()
		}else if (event.key === "e"){
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
			annotation_data[currentFrame] = JSON.parse(JSON.stringify(previous_annotation))
			frame_data[currentFrame] = JSON.parse(JSON.stringify(previous_canvas_annotation))
			changeSave(true)
		}
	}  

	useEffect(() => {
		document.addEventListener("keydown", onKeyPress);
		return () => document.removeEventListener("keydown", onKeyPress);
	}, [onKeyPress]);
	
	fabricCanvas.loadFromJSON(frame_data[currentFrame], function() {
		fabricCanvas.renderAll();
	});

	const handle_link_open = () => {
		window.open("https://forms.gle/CrJuYEoT39uFgnR17", "_blank")
	}

	const change_annotator_name = (event) => {
		ANNOTATOR_NAME = event
		console.log(ANNOTATOR_NAME)
	}

	const handle_visual_toggle = () => {
		setVisualToggle(Math.floor(Math.random() * 999999999999))
	}

	const handleSetPlaybackRate = (playbackRate) => {
		console.log(playbackRate)
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

	const handleOnPlay = () => {
		console.log(player)

	}

	const toggleKeyCheck = (toggle_val) => {
		console.log("Keycheck activated")
		console.log(toggle_val)
		if(toggle_val === undefined){
			changeKeyCheck(!keyCheck)
		}else{
			changeKeyCheck(toggle_val)
		}
	}

	const setFrameRate = (framerate) => {
		frame_rate = framerate
	}

	const setDateTime = (time) => {
		time_unix = time;
		console.log(time)
	}

	return (
		<div>
			<CustomNavBar 
				disable_buttons={disable_buttons} 
				video_width={video_width} 
				video_height={video_height} 
				skip_value={skip_value} 
				ANNOTATOR_NAME={ANNOTATOR_NAME}
				handle_link_open={handle_link_open}
				handleOldAnnotation={handleOldAnnotation}
				handleVideoUpload={handleVideoUpload}
				currentFrame={currentFrame}
				display_frame_num={"Frame #" + parseInt(currentFrame)+' / '+parseInt(duration * frame_rate)}
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
				columns={columns}
				handleSetPlaybackRate={handleSetPlaybackRate}
				toggleKeyCheck={toggleKeyCheck}
				setFrameRate={setFrameRate}
				frame_rate={frame_rate}
				setDateTime={setDateTime}
			/>
			<Toast 
				onClose={() => changeSave(false)} 
				show={save} delay={500} autohide
				style={{ position: 'absolute',top: 0, left: '40%', zIndex: 100}}
			>
				<Toast.Header>
					<strong className="mr-auto">{toast_text}</strong>
				</Toast.Header>
			</Toast>
			{
				upload === true && 
				<div style={{display: "grid"}} show={upload}>
					<div style={{gridColumn: 1, gridRow:1, position: "relative", width: scaling_factor_width, height: scaling_factor_height, top: 0, left: 0}}>
						<ReactPlayer 
							onProgress={handleSetCurrentFrame} 
							ref={handleSetPlayer} 
							onDuration={handleSetDuration} 
							url={videoFilePath} 
							width='100%'
							height='99.999%'
							playing={playing} 
							controls={false} 
							style={{position:'absolute', float:'left', top:0, left:0}}
							volume={0}
							muted={true}
							pip={false}
							playbackRate={playbackRate}
							onPlay={handleOnPlay}
						/>
					</div>
					<div style={{gridColumn: 1, gridRow:1, position: "relative",  top: 0, left: 0}}>
						<FabricRender 
							fabricCanvas={fabricCanvas}
							currentFrame={currentFrame}
							save_data={save_data}
							scaling_factor_height={scaling_factor_height}
							scaling_factor_width={scaling_factor_width}
						/>
					</div>
					<div style={{gridColumn: 1, gridRow:2, position: "relative", width: scaling_factor_width, top: 0, left: 0}}>
						<input
							style={{width: scaling_factor_width}}
							type='range' min={0} max={0.999999} step='any'
							value={sliderPercent}
							onMouseDown={handleSeekMouseDown}
							onChange={handleSeekChange}
							onMouseUp={handleSeekMouseUp}
						/>
					</div>
					<div style={{gridColumn: 2, gridRow:1, position: "relative",width: scaling_factor_width*.4, height: scaling_factor_height, top: 0, left: 0}}>
						<AnnotationTable
							annotation_data={annotation_data}
							currentFrame={currentFrame}
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


