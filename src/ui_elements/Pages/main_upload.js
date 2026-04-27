//Core imports
import React, { useEffect, useRef, useState } from "react";
import { fabric } from 'fabric';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

//Constants
import {INPUT_IMAGE, INPUT_VIDEO} from '../../static_data/const'

//Processing
import ExtractingAnnotation from '../../processing/annotation-processing'
import ExportingAnnotation from '../../processing/exporting_annotation'
import { getFrameSource, loadFrameSource } from '../../processing/frame_source_registry'
import { deleteAutosaveSession, getAutosaveSession, saveAutosaveSession } from '../../processing/session_autosave'

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
		initMedia, setMedia,
		initMetadata, setRes, setFrameRate, setTotalFrames,
        setSkipValue, setPlaybackSpeed,
        initColumnData,
		initPlay, togglePlay} from '../../processing/actions'
import { useSelector } from "react-redux";

// Data imports
import default_column from '../../static_data/basic_column_config.json'

const ANNOTATION_TOOL_DETAILS = {
	[ANNOTATION_FRAME]: { label: "Behavior Annotation", shortcut: "1" },
	[ANNOTATION_BBOX]: { label: "Bounding Box", shortcut: "2" },
	[ANNOTATION_SEG]: { label: "Segmentation", shortcut: null },
	[ANNOTATION_KEYPOINT]: { label: "Key Point", shortcut: "4" },
}

const NAV_HEIGHT = 160;
const WORKSPACE_PADDING = 24;
const WORKSPACE_GAP = 12;
const SIDE_PANEL_WIDTH = 560;
const VIDEO_ASPECT_RATIO = 16 / 9;
const AUTOSAVE_DEBOUNCE_MS = 1500;
const BBOX_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];

const autosaveStatusText = {
	idle: "Autosave ready",
	dirty: "Unsaved changes",
	saving: "Saving locally...",
	saved: "Saved locally",
	error: "Autosave failed",
}

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

const serializeMediaData = (mediaData) => {
	return (mediaData || []).map((streamMedia) => {
		if(!streamMedia){
			return []
		}
		return Array.from(streamMedia).filter(Boolean)
	})
}

const hasAutosaveMedia = (session) => {
	return Boolean(session?.mediaData?.some((streamMedia) => streamMedia?.length > 0))
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
	const [toastText, setToastText] = useState("")
	const [projectName, setProjectName] = useState("")
	const [autosaveCandidate, setAutosaveCandidate] = useState(null)
	const [isCheckingAutosave, setIsCheckingAutosave] = useState(true)
	const [isRestoringAutosave, setIsRestoringAutosave] = useState(false)
	const [autosaveStatus, setAutosaveStatus] = useState("idle")
	const [lastSavedAt, setLastSavedAt] = useState(null)
	const [autosaveError, setAutosaveError] = useState("")
	const [forceUploadClosedToken, setForceUploadClosedToken] = useState(0)
	const [pendingBoundingBox, setPendingBoundingBox] = useState(null)
	const [deleteSelectedRequest, setDeleteSelectedRequest] = useState(0)
	const autosaveTimeoutRef = useRef(null)
	const autosaveReadyRef = useRef(false)
	const restoredAutosaveRef = useRef(false)

	//New state vars
	const [currAnnotationData, setCurrAnnotationData] = useState([])

	const annot_redux = useSelector(state => state.annotation_data.data)
	const frame_redux = useSelector(state => state.frame_data.data)
	const column_redux = useSelector(state => state.column_annot.data)
	const currframe_redux = useSelector(state => state.current_frame)['data']
	const imagedata_redux = useSelector(state => state.media_data.data)
	const metadata_redux = useSelector(state => state.metadata)
	var inputType = metadata_redux['media_type']
	var skip_value = parseInt(metadata_redux['skip_value']) || 1
	var total_frames = parseInt(metadata_redux['total_frames']) || 0
	var frame_rate = parseFloat(metadata_redux['frame_rate']) || 0
	var playback_speed = parseFloat(metadata_redux['playback_speed']) || 1

	const createAutosavePayload = () => {
		const state = store.getState()
		const metadata = JSON.parse(JSON.stringify(state.metadata))
		const exportedAnnotations = new ExportingAnnotation(
			state.frame_data.data,
			scaling_factor_width,
			scaling_factor_height,
			metadata,
			state.media_data.data[0]
		).get_frame_json()

		return {
			projectName: projectName || ANNOTATION_VIDEO_NAME || "Untitled AVAT project",
			annotationType,
			boxCount,
			currentFrame: state.current_frame.data || 0,
			metadata,
			columnData: state.column_annot.data,
			mediaData: serializeMediaData(state.media_data.data),
			annotationJson: {
				vid_metadata: metadata,
				annotations: exportedAnnotations,
				behavior_data: state.annotation_data.data,
			},
		}
	}

	const handleProjectNameChange = (name) => {
		ANNOTATION_VIDEO_NAME = name
		setProjectName(name)
	}

	const handleRestoreAutosave = async () => {
		if(!autosaveCandidate){
			return
		}

		setIsRestoringAutosave(true)
		try{
			const savedMediaData = autosaveCandidate.mediaData || [[]]
			const savedMetadata = autosaveCandidate.metadata || autosaveCandidate.annotationJson?.vid_metadata || metadata_redux
			const currentFrame = autosaveCandidate.currentFrame || 0

			initMedia(Math.max(1, savedMediaData.length))
			for(var i = 0; i < savedMediaData.length; i++){
				setMedia(i, savedMediaData[i] || [])
			}

			if(savedMetadata.media_type === INPUT_VIDEO){
				const savedVideoFile = savedMediaData?.[0]?.[0]
				if(!savedVideoFile){
					throw new Error("Autosaved annotations were found, but the source video is no longer available in browser storage.")
				}
				await loadFrameSource(0, savedVideoFile)
			}else if(savedMetadata.media_type === INPUT_IMAGE && !hasAutosaveMedia(autosaveCandidate)){
				throw new Error("Autosaved annotations were found, but the source images are no longer available in browser storage.")
			}

			initMetadata(
				savedMetadata.horizontal_res,
				savedMetadata.vertical_res,
				savedMetadata.frame_rate,
				savedMetadata.media_type,
				savedMetadata.total_frames,
				savedMetadata.playback_speed || 1
			)
			setSkipValue(savedMetadata.skip_value || 1)
			if(autosaveCandidate.columnData){
				initColumnData(autosaveCandidate.columnData)
			}else{
				initColumnData(default_column)
			}

			const restoredAnnotation = new ExtractingAnnotation(autosaveCandidate.annotationJson, scaling_factor_width, scaling_factor_height)
			store.dispatch({
				type: "frame_data/initOldAnnotation",
				payload: restoredAnnotation.get_frame_data()
			});
			store.dispatch({
				type: "annotation_data/initOldAnnotation",
				payload: restoredAnnotation.get_annotation_data()
			});
			setCurrentFrame(currentFrame)
			setAnnotationType(autosaveCandidate.annotationType || ANNOTATION_FRAME)
			setBoxCount(autosaveCandidate.boxCount || 0)
			setProjectName(autosaveCandidate.projectName || "")
			ANNOTATION_VIDEO_NAME = autosaveCandidate.projectName || ""
			setCurrAnnotationData(restoredAnnotation.get_annotation_data()?.[currentFrame] || [])

			upload = true
			disable_buttons = false
			setVisualToggle(Math.floor(Math.random() * 999999999999))
			setIsUploadModalOpen(false)
			setForceUploadClosedToken((token) => token + 1)
			setAutosaveCandidate(null)
			setAutosaveStatus("saved")
			setAutosaveError("")
			setLastSavedAt(autosaveCandidate.updatedAt ? new Date(autosaveCandidate.updatedAt) : new Date())
			restoredAutosaveRef.current = true
		} catch(error){
			setAutosaveError(error.message || "Unable to restore autosaved session.")
			setAutosaveStatus("error")
		} finally {
			setIsRestoringAutosave(false)
		}
	}

	const handleDiscardAutosave = async () => {
		try{
			await deleteAutosaveSession()
			setAutosaveCandidate(null)
			setAutosaveStatus("idle")
			setAutosaveError("")
		} catch(error){
			setAutosaveError(error.message || "Unable to delete autosaved session.")
			setAutosaveStatus("error")
		}
	}

	useEffect(() => {
		let cancelled = false
		getAutosaveSession()
			.then((session) => {
				if(cancelled){
					return
				}
				if(session?.annotationJson){
					setAutosaveCandidate(session)
					setLastSavedAt(session.updatedAt ? new Date(session.updatedAt) : null)
				}
			})
			.catch((error) => {
				if(!cancelled){
					setAutosaveError(error.message || "Autosave storage is unavailable.")
				}
			})
			.finally(() => {
				if(!cancelled){
					setIsCheckingAutosave(false)
					autosaveReadyRef.current = true
				}
			})

		return () => {
			cancelled = true
		}
	}, [])

	useEffect(() => {
		if(upload == true){
			var annot = getAnnotationData(currframe_redux)
			setCurrAnnotationData(annot)
		}
	}, [currframe_redux])

	useEffect(()=>{
		if(annot_redux.length === 1 && !restoredAutosaveRef.current){
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
		if(currAnnotationData == null){
			setCurrAnnotationData([])
		}

		var annotation_type_txt = "error"

		if (annotationType === ANNOTATION_BBOX){
			beginBoundingBoxDraw()
			return
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

	const beginBoundingBoxDraw = () => {
		if(pendingBoundingBox){
			showToast("Drag on the media to finish the current bounding box")
			return
		}

		const id = boxCount + 'b'
		setPendingBoundingBox({
			id,
			color: BBOX_COLORS[boxCount % BBOX_COLORS.length],
		})
		showToast("Drag on the media to draw bounding box " + id)
	}

	const handleBoundingBoxCreated = (boundingBox) => {
		var saved_annot = getAnnotationData(getCurrentFrame())
		var generated_annotation = create_annotation(boundingBox.id)
		saved_annot = Object.assign([], saved_annot)
		saved_annot.push(generated_annotation)
		updateAnnotationData(currframe_redux, saved_annot)
		setPendingBoundingBox(null)
		setBoxCount(boxCount + 1)
		showToast("Added bounding box " + boundingBox.id)
	}

	const handleBoundingBoxCancelled = () => {
		setPendingBoundingBox(null)
		showToast("Bounding box cancelled")
	}

	const handleBoundingBoxDeleted = (localId) => {
		var curr_data = getAnnotationData(getCurrentFrame()) || []
		var next_data = curr_data.filter((annotation) => annotation.id !== localId)
		updateAnnotationData(currframe_redux, next_data)
		showToast("Removed annotation " + localId)
	}

	const removeSelectedAnnotation = () => {
		if(pendingBoundingBox){
			setPendingBoundingBox(null)
			showToast("Bounding box cancelled")
			return
		}
		setDeleteSelectedRequest((request) => request + 1)
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
  
	const clampFrame = (frameNumber) => {
		var lastFrame = Math.max(0, total_frames - 1)
		var parsedFrame = parseInt(frameNumber)
		if(Number.isNaN(parsedFrame)){
			return currframe_redux || 0
		}
		return Math.min(Math.max(parsedFrame, 0), lastFrame)
	}

	const goToFrame = (frameNumber) => {
		setCurrentFrame(clampFrame(frameNumber))
	}

	const jumpToFrameNumber = (frameNumber) => {
		goToFrame(parseInt(frameNumber) - 1)
	}

	const skip_frame_forward = e =>{
		goToFrame(currframe_redux + skip_value)
	}

	const skip_frame_backward = e => {
		goToFrame(currframe_redux - skip_value)
	}

	const getAnnotationToolDetails = (toolType) => {
		return ANNOTATION_TOOL_DETAILS[toolType] || { label: "Unknown Tool", shortcut: null }
	}

	const showToast = (message) => {
		toast_text = message
		setToastText(message)
		changeSave(true)
	}

	const getEditableAnnotationKeys = () => {
		var leafColumns = getLeafColumns(column_redux?.columns || [])
		return leafColumns
			.map((column) => column.accessorKey || column.id)
			.filter((columnId) => columnId && !["id", "remove", "dataType", "fileName"].includes(columnId))
	}

	const isBlankAnnotationValue = (value) => {
		return value === undefined || value === null || String(value).trim() === ""
	}

	const isAnnotatedFrame = (frameNumber) => {
		return Boolean((frame_redux?.[frameNumber]?.length || 0) > 0 || (annot_redux?.[frameNumber]?.length || 0) > 0)
	}

	const isIncompleteFrame = (frameNumber) => {
		var frameAnnotations = annot_redux?.[frameNumber] || []
		var frameObjects = frame_redux?.[frameNumber] || []
		if(frameAnnotations.length === 0 && frameObjects.length === 0){
			return true
		}

		var editableKeys = getEditableAnnotationKeys()
		if(editableKeys.length === 0){
			return false
		}

		return frameAnnotations.some((annotation) => {
			return editableKeys.some((columnId) => isBlankAnnotationValue(annotation[columnId]))
		})
	}

	const findFrame = (startFrame, step, predicate) => {
		for(var frameNumber = startFrame; frameNumber >= 0 && frameNumber < total_frames; frameNumber += step){
			if(predicate(frameNumber)){
				return frameNumber
			}
		}
		return null
	}

	const goToPreviousAnnotatedFrame = () => {
		var targetFrame = findFrame(currframe_redux - 1, -1, isAnnotatedFrame)
		if(targetFrame === null){
			showToast("No previous annotated frame")
			return
		}
		goToFrame(targetFrame)
	}

	const goToNextAnnotatedFrame = () => {
		var targetFrame = findFrame(currframe_redux + 1, 1, isAnnotatedFrame)
		if(targetFrame === null){
			showToast("No next annotated frame")
			return
		}
		goToFrame(targetFrame)
	}

	const goToNextIncompleteFrame = () => {
		var targetFrame = findFrame(currframe_redux + 1, 1, isIncompleteFrame)
		if(targetFrame === null){
			showToast("No incomplete frame ahead")
			return
		}
		goToFrame(targetFrame)
	}

	const copyPreviousFrameAnnotations = () => {
		if(currframe_redux <= 0){
			showToast("No previous frame to copy")
			return
		}

		var currentFrameData = getFrameData(currframe_redux) || []
		var currentAnnotationData = getAnnotationData(currframe_redux) || []
		if(currentFrameData.length > 0 || currentAnnotationData.length > 0){
			showToast("Current frame already has annotations")
			return
		}

		var previousFrame = currframe_redux - 1
		var previousFrameData = getFrameData(previousFrame) || []
		var previousAnnotationData = getAnnotationData(previousFrame) || []
		if(previousFrameData.length === 0 && previousAnnotationData.length === 0){
			showToast("Previous frame has no annotations")
			return
		}

		var copiedAnnotationData = previousAnnotationData.map((annotation) => {
			var copiedAnnotation = Object.assign({}, annotation)
			if(inputType === INPUT_VIDEO){
				copiedAnnotation.fileName = "frame_" + currframe_redux
			}
			return copiedAnnotation
		})

		updateFrameData(currframe_redux, previousFrameData)
		updateAnnotationData(currframe_redux, copiedAnnotationData)
		showToast("Copied annotations from previous frame")
	}

	const handlePlaybackSpeedChange = (speed) => {
		var parsedSpeed = parseFloat(speed)
		setPlaybackSpeed(parsedSpeed > 0 ? parsedSpeed : 1)
	}

	const change_annotation_type = (event) => {
		setAnnotationType(event)
		showToast("Switched to " + getAnnotationToolDetails(event).label)
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
			change_annotation_type(ANNOTATION_BBOX)
		}else if (event.key === ANNOTATION_KEYPOINT){
			change_annotation_type(ANNOTATION_KEYPOINT)
		}else if(event.key === ANNOTATION_SEG) {
			// toast_text = "Mode Switch: Segmentation"
			// changeSave(true)
			// setAnnotationType(ANNOTATION_SEG)
		}else if(event.key === ANNOTATION_FRAME){
			change_annotation_type(ANNOTATION_FRAME)
		}else if (event.key === "a"){
			showToast("Added Annotation - " + getAnnotationToolDetails(annotationType).label)
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
		}else if(event.key === "["){
			goToPreviousAnnotatedFrame()
		}else if(event.key === "]"){
			goToNextAnnotatedFrame()
		}else if(event.key === "i"){
			goToNextIncompleteFrame()
		}else if(event.key === "c"){
			copyPreviousFrameAnnotations()
		}else if(event.key === "r"){
			removeSelectedAnnotation()
		}else if(event.key === "Escape" && pendingBoundingBox){
			setPendingBoundingBox(null)
			showToast("Bounding box cancelled")
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
		const timeout = setTimeout(() => changeSave(false), 1200);
		return () => clearTimeout(timeout);
	}, [save, toastText]);

	useEffect(() => {
		return () => {
			if(autosaveTimeoutRef.current){
				clearTimeout(autosaveTimeoutRef.current)
			}
		}
	}, [])

	useEffect(() => {
		if(!autosaveReadyRef.current || isCheckingAutosave || autosaveCandidate || isRestoringAutosave || upload !== true){
			return
		}
		if(!frame_redux || frame_redux.length === 0 || !metadata_redux.total_frames){
			return
		}
		if(restoredAutosaveRef.current){
			restoredAutosaveRef.current = false
			return
		}

		if(autosaveTimeoutRef.current){
			clearTimeout(autosaveTimeoutRef.current)
		}

		setAutosaveStatus("dirty")
		autosaveTimeoutRef.current = setTimeout(async () => {
			setAutosaveStatus("saving")
			try{
				await saveAutosaveSession(createAutosavePayload())
				setLastSavedAt(new Date())
				setAutosaveStatus("saved")
				setAutosaveError("")
			}catch(error){
				setAutosaveError(error.message || "Unable to save this session locally.")
				setAutosaveStatus("error")
			}
		}, AUTOSAVE_DEBOUNCE_MS)

		return () => {
			if(autosaveTimeoutRef.current){
				clearTimeout(autosaveTimeoutRef.current)
			}
		}
	}, [annot_redux, frame_redux, column_redux, metadata_redux, currframe_redux, imagedata_redux, annotationType, boxCount, projectName, visualToggle, isCheckingAutosave, autosaveCandidate, isRestoringAutosave])

	useEffect(() => {
		const warnBeforeUnload = (event) => {
			if(autosaveStatus !== "dirty" && autosaveStatus !== "saving" && autosaveStatus !== "error"){
				return
			}
			event.preventDefault()
			event.returnValue = ""
		}

		window.addEventListener("beforeunload", warnBeforeUnload)
		return () => window.removeEventListener("beforeunload", warnBeforeUnload)
	}, [autosaveStatus])
	

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
						pendingBoundingBox={pendingBoundingBox}
						onBoundingBoxCreated={handleBoundingBoxCreated}
						onBoundingBoxCancelled={handleBoundingBoxCancelled}
						deleteSelectedRequest={deleteSelectedRequest}
						onBoundingBoxDeleted={handleBoundingBoxDeleted}
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
			<Dialog open={Boolean(autosaveCandidate) && !isCheckingAutosave}>
				<DialogContent className="sm:max-w-lg" showCloseButton={false}>
					<DialogHeader>
						<DialogTitle>Restore autosaved session?</DialogTitle>
						<div className="space-y-2 text-sm text-zinc-600">
							<p>
								A local autosave was found for {autosaveCandidate?.projectName || "an AVAT project"}.
							</p>
							{lastSavedAt &&
								<p>Last saved: {lastSavedAt.toLocaleString()}</p>
							}
							{autosaveError &&
								<p className="rounded-md border border-red-200 bg-red-50 p-2 text-red-700">{autosaveError}</p>
							}
						</div>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={handleDiscardAutosave} disabled={isRestoringAutosave}>Start new project</Button>
						<Button onClick={handleRestoreAutosave} disabled={isRestoringAutosave}>
							{isRestoringAutosave ? "Restoring..." : "Restore session"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<CustomNavBar 
				disable_buttons={disable_buttons} 
				video_width={scaling_factor_width} 
				video_height={scaling_factor_height} 
				skip_value={skip_value} 
				handleOldAnnotation={handleOldAnnotation}
				currentFrame={currframe_redux}
				totalFrames={total_frames}
				frameRate={frame_rate}
				playbackSpeed={playback_speed}
				mediaType={inputType}
				display_frame_num={"Frame #" + parseInt(currframe_redux+1)+' / '+parseInt(metadata_redux['total_frames'])}
				goToFrame={goToFrame}
				jumpToFrameNumber={jumpToFrameNumber}
				skip_frame_forward={skip_frame_forward}
				skip_frame_backward={skip_frame_backward}
				goToPreviousAnnotatedFrame={goToPreviousAnnotatedFrame}
				goToNextAnnotatedFrame={goToNextAnnotatedFrame}
				goToNextIncompleteFrame={goToNextIncompleteFrame}
				onPlaybackSpeedChange={handlePlaybackSpeedChange}
				addToCanvas={addToCanvas}
				ANNOTATION_VIDEO_NAME={ANNOTATION_VIDEO_NAME}
				change_annotation_type={change_annotation_type}
				annotation_tool={getAnnotationToolDetails(annotationType)}
				VIDEO_METADATA={VIDEO_METADATA}
				toggleKeyCheck={toggleKeyCheck}
				onUploadModalChange={setIsUploadModalOpen}
				handle_visual_toggle={handle_visual_toggle}
				onProjectNameChange={handleProjectNameChange}
				hideUploadModal={isCheckingAutosave || Boolean(autosaveCandidate)}
				forceUploadClosedToken={forceUploadClosedToken}
				autosaveStatus={autosaveStatusText[autosaveStatus] || autosaveStatusText.idle}
				lastSavedAt={lastSavedAt}
				autosaveError={autosaveError}
			/>
			{save &&
				<div className="absolute left-[100px] top-[64px] z-[100] rounded-md border bg-background px-4 py-3 text-sm font-medium shadow-md">
					{toastText || toast_text}
				</div>
			}
			{
				upload === true && 
				<main className="grid min-h-[calc(100vh-160px)] grid-cols-1 gap-3 overflow-auto p-3 xl:h-[calc(100vh-160px)] xl:grid-cols-[minmax(0,1fr)_560px] xl:overflow-hidden">
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
