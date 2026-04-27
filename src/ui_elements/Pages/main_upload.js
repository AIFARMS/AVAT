//Core imports
import React, { useEffect, useState } from "react";
import { fabric } from 'fabric';

//Constants
import {INPUT_IMAGE, INPUT_VIDEO} from '../../static_data/const'

//Processing
import ExtractingAnnotation from '../../processing/annotation-processing'
import { getFrameSource } from '../../processing/frame_source_registry'

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
		getColumnData,
		initCurrentFrame, getCurrentFrame, setCurrentFrame,
		initMedia,
		initMetadata, setRes, setFrameRate, setTotalFrames,
        initColumnData,
		initPlay, togglePlay} from '../../processing/actions'
import { useSelector } from "react-redux";

// Data imports
import default_column from '../../static_data/basic_column_config.json'

const NAV_HEIGHT = 48;
const WORKSPACE_PADDING = 24;
const WORKSPACE_GAP = 12;
const SIDE_PANEL_WIDTH = 560;
const VIDEO_ASPECT_RATIO = 16 / 9;

const getCanvasDisplaySize = (streamCount = 1) => {
	if(typeof window === 'undefined'){
		return { width: 1280, height: 720 }
	}

	const streamTotal = Math.max(1, streamCount);
	const isWideLayout = window.innerWidth >= 1280;
	const panelWidth = isWideLayout ? SIDE_PANEL_WIDTH + WORKSPACE_GAP : 0;
	const availableWidth = Math.max(640, window.innerWidth - WORKSPACE_PADDING - panelWidth);
	const availableHeight = Math.max(360, (window.innerHeight - NAV_HEIGHT - WORKSPACE_PADDING - (WORKSPACE_GAP * (streamTotal - 1))) / streamTotal);
	const width = Math.floor(Math.min(availableWidth, availableHeight * VIDEO_ASPECT_RATIO));
	const height = Math.floor(width / VIDEO_ASPECT_RATIO);

	return { width, height };
}

var { width: scaling_factor_width, height: scaling_factor_height } = getCanvasDisplaySize();

var upload = false;
var disable_buttons = true;
var toast_text = ""
var ANNOTATION_VIDEO_NAME = ""
var VIDEO_METADATA = {}
var play_button_text = "Play"
var segmentation_flag = false;

const isKeybindTargetBlocked = (event) => {
	const target = event.target
	if(!target){
		return false
	}

	if(target.isContentEditable){
		return true
	}

	const tagName = target.tagName
	if(!tagName){
		return false
	}

	return ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(tagName)
}

//TODO remove after fixing null exceptions
//initAnnotationData(1)
//initFrameData(1)
initCurrentFrame(0)
initMetadata(scaling_factor_width, scaling_factor_height, null, INPUT_VIDEO, 1)
initPlay()
console.log(default_column)
initColumnData(
    default_column
)

//Current frame counter
export default function MainUpload() {
	const [visualToggle, setVisualToggle] = useState(0);
	const [annotationType, setAnnotationType] = useState("1")
	const [boxCount, setBoxCount] = useState(0)
	const [oldAnnotation, setOldAnnotation] = useState(null)
	const [save, changeSave] = useState(false);
	const [keyCheck, changeKeyCheck] = useState(true)
	const [isLoading, setIsLoading] = useState(true)
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(true)

	//New state vars
	const [currAnnotationData, setCurrAnnotationData] = useState([])

	const annot_redux = useSelector(state => state.annotation_data.data)
	const column_redux = useSelector(state => state.column_annot.data)
	const currframe_redux = useSelector(state => state.current_frame)['data']
	const imagedata_redux = useSelector(state => state.media_data.data)
	const metadata_redux = useSelector(state => state.metadata)
	var inputType = metadata_redux['media_type']
	var skip_value = parseInt(metadata_redux['skip_value'])

	useEffect(() => {
		if(upload == true){
			var annot = getAnnotationData(currframe_redux)
			setCurrAnnotationData(annot)
		}
	}, [currframe_redux])

	useEffect(()=>{
		if(annot_redux.length === 1){
			initAnnotationData(metadata_redux.total_frames)
			initFrameData(metadata_redux.total_frames)
		}
	}, [metadata_redux]);

	useEffect(() => {
		if(imagedata_redux[0].length != 0){
			if(metadata_redux['media_type'] == INPUT_IMAGE){
				setTotalFrames(imagedata_redux[0].length)
				upload = true
				disable_buttons = false
				initAnnotationData(imagedata_redux[0].length)
				initFrameData(imagedata_redux[0].length)
				var url = (imagedata_redux[0][0])
				var img = new Image;
				img.onload = function() {
					VIDEO_METADATA = {"horizontal_res": img.width, "vertical_res": img.height}
					URL.revokeObjectURL(img.src)
				}
				img.src = url
				setVisualToggle(10)
			}else if(metadata_redux['media_type'] == INPUT_VIDEO && metadata_redux['total_frames'] > 1){
				const frameSource = getFrameSource(0)
				upload = true
				disable_buttons = false
				if(frameSource){
					VIDEO_METADATA = {"horizontal_res": frameSource.width, "vertical_res": frameSource.height}
				}
				setVisualToggle(10)
			}
		}
		const canvasDisplaySize = getCanvasDisplaySize(imagedata_redux.length)
		scaling_factor_width = canvasDisplaySize.width
		scaling_factor_height = canvasDisplaySize.height


	}, [imagedata_redux, metadata_redux.total_frames, metadata_redux.media_type])

	const addToCanvas = () => {
		var color = "#" + ((1<<24)*Math.random() | 0).toString(16)
		
		if(currAnnotationData == null){
			setCurrAnnotationData([])
		}

		var annotation_type_txt = "error"

		if (annotationType === ANNOTATION_BBOX){
			annotation_type_txt = "b"
			var new_bbox = new BoundingBox(50, 50, 50, 50, color, boxCount+'b', "None").generate_no_behavior()
			var frame_dat = getFrameData(getCurrentFrame())
			frame_dat = Object.assign([], frame_dat)
			frame_dat.push(new_bbox)
			updateFrameData(currframe_redux, frame_dat)
			//updateFrameData(currframe_redux, [new_bbox])
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
		columns = getLeafColumns(columns['data']['columns'])
		for(var i = 0; i < columns.length; i++){
			var curr_val = columns[i]
			if(curr_val.accessorKey){
				new_data[curr_val.accessorKey] = ""
			}
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

	const getLeafColumns = (columns) => {
		var leafColumns = []
		if(!columns){
			return leafColumns
		}
		for(var i = 0; i < columns.length; i++){
			if(columns[i].columns){
				leafColumns = leafColumns.concat(getLeafColumns(columns[i].columns))
			}else{
				leafColumns.push(columns[i])
			}
		}
		return leafColumns
	}

	const toggle_segmentation = (event) => {
		segmentation_flag = !segmentation_flag
	}

	const handleOldAnnotation = (event) => {
		var promise = downloadOldAnnotation(event)
		promise.then(function (result) {
			if(result != null){
				setOldAnnotation(new ExtractingAnnotation(result, scaling_factor_width, scaling_factor_height));
				setRes(result.vid_metadata.horizontal_res, result.vid_metadata.vertical_res)
			}else{
				alert("Error in processing Annotation. Please check the file and try again.")
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
		setFrameRate(oldAnnotation.get_frame_rate())
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

	const onKeyPress = (event) =>{
		if(upload !== true || isUploadModalOpen || isKeybindTargetBlocked(event)){
			return;
		}
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
			// toast_text = "Mode Switch: Segmentation"
			// changeSave(true)
			// setAnnotationType(ANNOTATION_SEG)
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
		}else if (event.key === "e"){
			skip_frame_forward()
		}else if(event.key === "w"){
		    togglePlay()
		}
	}  

	useEffect(() => {
		document.addEventListener("keydown", onKeyPress);
		return () => document.removeEventListener("keydown", onKeyPress);
	}, [onKeyPress]);

	useEffect(() => {
		if (!save) {
			return;
		}
		const timeout = setTimeout(() => changeSave(false), 500);
		return () => clearTimeout(timeout);
	}, [save]);
	

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
				<div key={i} className="relative shrink-0 overflow-hidden bg-black shadow-sm" style={{width: scaling_factor_width, height: scaling_factor_height}}>
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
		return(
			<div className="flex flex-col gap-3">
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
		<div className="min-h-screen bg-zinc-100">
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
				addToCanvas={addToCanvas}
				ANNOTATION_VIDEO_NAME={ANNOTATION_VIDEO_NAME}
				change_annotation_type={change_annotation_type}
				VIDEO_METADATA={VIDEO_METADATA}
				toggleKeyCheck={toggleKeyCheck}
				onUploadModalChange={setIsUploadModalOpen}
				handle_visual_toggle={handle_visual_toggle}
			/>
			{save &&
				<div className="absolute left-[100px] top-[100px] z-[100] rounded-md border bg-background px-4 py-3 text-sm font-medium shadow-md">
					{toast_text}
				</div>
			}
			{
				upload === true && 
				<main className="grid min-h-[calc(100vh-48px)] grid-cols-1 gap-3 overflow-auto p-3 xl:h-[calc(100vh-48px)] xl:grid-cols-[minmax(0,1fr)_560px] xl:overflow-hidden">
					<section className="min-h-0 overflow-auto rounded-lg bg-zinc-950 p-3 shadow-inner">
						<div className="flex min-h-full items-start justify-center">
							{genFabricCanvas()}
						</div>
					</section>
					<aside className="min-h-[280px] overflow-hidden rounded-lg border bg-white shadow-sm xl:min-h-0">
						<AnnotationTable
							annotation_data={currAnnotationData}
							change_annotation_data={handleChangeAnnot}
							currentFrame={currframe_redux}
							toggleKeyCheck={toggleKeyCheck}
							columns={columns}
						/>
					</aside>
				</main>
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
