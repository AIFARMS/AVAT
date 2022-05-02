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
		initCurrentFrame, getCurrentFrame, setCurrentFrame,
		initMedia, setMedia,
		initMetadata, setRes, setFrameRate, setMediaType, setTotalFrames} from '../../processing/actions'
import { useSelector } from "react-redux";

const fabric = require("fabric").fabric;

//TODO ADD DYNAMIC SOLUTION 
var frame_rate = 15;
var num_frames = -1;
var scaling_factor_width = 1920;
var scaling_factor_height = 1080;

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

var upload = false;
var disable_buttons = true;
var toast_text = ""
var ANNOTATION_VIDEO_NAME = ""
var VIDEO_METADATA = {}
var play_button_text = "ERROR"
var segmentation_flag = false;

//TODO remove after fixing null exceptions
initAnnotationData(1)
initFrameData(1)
initCurrentFrame(0)
initMetadata(scaling_factor_width, scaling_factor_height, 1, INPUT_VIDEO, 1)


//Current frame counter
export default function MainUpload() {
	const [visualToggle, setVisualToggle] = useState(0);
	const [annotationType, setAnnotationType] = useState("1")
	const [boxCount, setBoxCount] = useState(0)
	const [videoFilePath, setVideoFileURL] = useState(null);
	const [oldAnnotation, setOldAnnotation] = useState(null)
	const [save, changeSave] = useState(false);
	const [keyCheck, changeKeyCheck] = useState(true)
	const [isLoading, setIsLoading] = useState(true)

	//New state vars
	const [currFrameData, setCurrFrameData] = useState([])
	const [currAnnotationData, setCurrAnnotationData] = useState([])

	const annot_redux = useSelector(state => state.annotation_data.data)
	const column_redux = useSelector(state => state.column_annot.data)
	const currframe_redux = useSelector(state => state.current_frame)['data']
	const imagedata_redux = useSelector(state => state.media_data.data)
	const metadata_redux = useSelector(state => state.metadata)
	console.log(metadata_redux['media_type'] == INPUT_VIDEO)
	var inputType = metadata_redux['media_type']
	var skip_value = parseInt(metadata_redux['skip_value'])

	useEffect(() => {
		if(upload == true){
			var annot = getAnnotationData(currframe_redux)
			setCurrAnnotationData(annot)
		}
	}, [currframe_redux])

	useEffect(()=>{
		initAnnotationData(metadata_redux.total_frames)
        initFrameData(metadata_redux.total_frames)
	}, [metadata_redux])

	useEffect(() => {
		if(imagedata_redux[0].length != 0){
			if(metadata_redux['media_type'] == INPUT_IMAGE){
				setTotalFrames(imagedata_redux[0].length)
				upload = true
				disable_buttons = false
				initAnnotationData(imagedata_redux[0].length)
				initFrameData(imagedata_redux[0].length)
				var url = URL.createObjectURL(imagedata_redux[0][0])
				var img = new Image;
				img.onload = function() {
					VIDEO_METADATA = {"horizontal_res": img.width, "vertical_res": img.height}
					URL.revokeObjectURL(img.src)
				}
				img.src = url
				setVisualToggle(10)
			}else if(metadata_redux['media_type'] == INPUT_VIDEO){
				upload = true
				disable_buttons = false
				initAnnotationData(imagedata_redux[0].length)
				initFrameData(imagedata_redux[0].length)
				setVisualToggle(10)
			}
		}
		scaling_factor_width = 1920;
		scaling_factor_height = 1080;
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
		scaling_factor_height = scaling_factor_height * (1/imagedata_redux.length)
		scaling_factor_width = scaling_factor_width * (1/imagedata_redux.length)


	}, [imagedata_redux])

	const addToCanvas = () => {
		var color = "#" + ((1<<24)*Math.random() | 0).toString(16)
		
		if(currAnnotationData == null){
			setCurrAnnotationData([])
		}

		var annotation_type_txt = "error"

		if (annotationType === ANNOTATION_BBOX){
			annotation_type_txt = "b"
			var new_bbox = new BoundingBox(50, 50, 50, 50, color, boxCount+'b', "None").generate_no_behavior()
			setCurrFrameData([new_bbox])
			updateFrameData(currframe_redux, [new_bbox])
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

		setBoxCount(boxCount + 1);
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
			new_data['fileName'] = "temp"//image_frames[currframe_redux]['name']
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

	//ASYNC Function  - To note that the data that comes out of this will be a bit delayed and this could cause some issues.
	const handleOldAnnotation = (event) => {
		var promise = downloadOldAnnotation(event)
		promise.then(function (result) {
			if(result != null){
				//alert("WIP on oldUpload- please report this bug")
				setOldAnnotation(new ExtractingAnnotation(result, scaling_factor_width, scaling_factor_height));
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
  
	const skip_frame_forward = e =>{
		var frameVal = currframe_redux + skip_value

		if(frameVal >= metadata_redux['total_frames']){
			if(inputType === INPUT_IMAGE){
				setCurrentFrame(metadata_redux['total_frames']-1)
				return;
			}
			setCurrentFrame(metadata_redux['total_frames']-1)
		}else{
			if(inputType === INPUT_IMAGE){
				setCurrentFrame(frameVal)
				return;
			}
			setCurrentFrame(frameVal)
		}
	}

	const skip_frame_backward = e => {
		var frameVal = currframe_redux - skip_value
		if(frameVal < 0){
			if(inputType === INPUT_IMAGE){
				setCurrentFrame(0)
				return;
			}
			setCurrentFrame(0)
		}else{
			if(inputType === INPUT_IMAGE){
				setCurrentFrame(frameVal)
				return;
			}
			setCurrentFrame(frameVal)
		}
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
			alert("Video is currently under development, please use images for now!")
		}else if (event.key === "e"){
			skip_frame_forward()
		}else if(event.key === "c"){
			
		}
	}  

	useEffect(() => {
		document.addEventListener("keydown", onKeyPress);
		return () => document.removeEventListener("keydown", onKeyPress);
	}, [onKeyPress]);
	

	const handle_visual_toggle = () => {
		setVisualToggle(Math.floor(Math.random() * 999999999999))
	}

	const toggleKeyCheck = (toggle_val) => {
		console.log("Keycheck activated")
		if(toggle_val === undefined){
			changeKeyCheck(!keyCheck)
		}else{
			changeKeyCheck(toggle_val)
		}
	}

	const handleChangeAnnot = val => {
		setCurrAnnotationData(val)
	}

	const genFabricCanvas = () => {
		var fcanvas = []
		for(var i = 0; i < imagedata_redux.length; i++){
			let canv = (
				<div style={{gridColumn: 1, gridRow:i+1, position: "relative",  top: 0, left: 0}}>
					<FabricRender 
						currentFrame={currframe_redux}
						scaling_factor_height={scaling_factor_height}
						scaling_factor_width={scaling_factor_width}
						stream_num={i}
					/>
				</div>
			)
			fcanvas.push(canv)
		}
		console.log(fcanvas)
		return(
			<div>
			{
				fcanvas.map((can, _) => {
					return (
						can
					)
				})
			}
			</div>
		)
	}

	return (
		<div>
			<CustomNavBar 
				disable_buttons={disable_buttons} 
				video_width={scaling_factor_width} 
				video_height={scaling_factor_height} 
				skip_value={skip_value} 
				handleOldAnnotation={handleOldAnnotation}
				currentFrame={currframe_redux}
				display_frame_num={"Frame #" + parseInt(currframe_redux+1)+' / '+parseInt(metadata_redux['total_frames'])}
				skip_frame_forward={skip_frame_forward}
				skip_frame_backward={skip_frame_backward}
				play_button_text={play_button_text}
				addToCanvas={addToCanvas}
				ANNOTATION_VIDEO_NAME={ANNOTATION_VIDEO_NAME}
				change_annotation_type={change_annotation_type}
				VIDEO_METADATA={VIDEO_METADATA}
				toggleKeyCheck={toggleKeyCheck}
				handle_visual_toggle={handle_visual_toggle}
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
					{genFabricCanvas()}
					<div style={{gridColumn: 2, gridRow:1, position: "relative", top: 0, left: 0}}>
						<AnnotationTable
							annotation_data={currAnnotationData}
							change_annotation_data={handleChangeAnnot}
							currentFrame={currframe_redux}
							toggleKeyCheck={toggleKeyCheck}
							columns={columns}
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