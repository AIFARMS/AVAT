import React, { useCallback, useEffect, useRef, useState } from "react"; 
import { fabric } from 'fabric';

import store from '../../store' 
import {initFrameData, updateFrameData, getFrameData, 
		initAnnotationData, updateAnnotationData, getAnnotationData, 
		initColumnData, getColumnData, 
		initCurrentFrame, getCurrentFrame, setCurrentFrame, setTotalFrames,} from '../../processing/actions'
import { useSelector } from "react-redux";

import {INPUT_IMAGE, INPUT_VIDEO} from '../../static_data/const'
import { getFrameSource } from '../../processing/frame_source_registry'
import { BoundingBox } from '../../annotations/bounding_box'


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
		if(image_url != null){
			var f_vid_img = new fabric.Image(image_url, {
				objectCaching: false,
				scaleX: scaling_factor_width / image_url.width,
				scaleY: scaling_factor_height / image_url.height
			});
			fabricCanvas.setBackgroundImage(f_vid_img);
		}
		fabricCanvas.renderAll();
	}
}

const getSafeFrameData = (frameNumber) => {
	try{
		return getFrameData(frameNumber) || []
	}catch(error){
		return []
	}
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
const SEGMENT_CLOSE_RADIUS = 12

const createSegmentationGroup = (points, id, color) => {
	const polygon = new fabric.Polygon(points, {
		strokeWidth: 2,
		stroke: color,
		fill: color,
		opacity: 0.38,
		scaleX: 1,
		scaleY: 1,
		objectCaching: false,
		transparentCorners: false,
		cornerColor: '#ffffff',
		cornerStrokeColor: '#111827',
		originX: 'center',
		originY: 'center',
	})
	polygon.local_id = id

	const displayText = new fabric.Text(id.toString(), {
		fontSize: 16,
		fontWeight: 'bold',
		top: points[0].y + 3,
		left: points[0].x + 4,
		uniScaleTransform: false,
		fill: 'white',
		backgroundColor: 'rgba(0,0,0,0.7)',
	})

	const group = new fabric.Group([polygon, displayText], {
		perPixelTargetFind: true,
		hasControls: false,
		hasBorders: false,
		lockMovementY: true,
		lockMovementX: true,
	})
	group.local_id = id
	group.toObject = (function(toObject) {
		return function() {
			return fabric.util.object.extend(toObject.call(this), {
				local_id: this.local_id
			});
		};
	})(group.toObject)

	return group
}

export default function FabricRender(props){
	const [fabricCanvas, setFabricCanvas] = useState(null)
	const [currindex, setCurrindex] = useState(0)
	const [upload, setUpload] = useState(false)
	const [frameToUpdate, setFrameToUpdate] = useState(0)
	const frameCanvasRef = useRef(null)
	const renderRequestRef = useRef(0)
	const lastDeleteRequestRef = useRef(0)
	const metadata_redux = useSelector(state => state.metadata)
	const frame_redux = useSelector(state => state.frame_data)
	const image_data_store = useSelector(state => state.media_data)
	const currFrame = useSelector(state => state.current_frame)
	const currframe_redux = currFrame['data']
	const play_redux = useSelector(state => state.play_status.play)
	const image_data = image_data_store['data'][props.stream_num]

	const renderVideoFrame = useCallback((frameNumber) => {
		if(!fabricCanvas){
			return Promise.resolve(false)
		}

		const frameSource = getFrameSource(props.stream_num)
		if(!frameSource){
			canvasBackgroundUpdate(getSafeFrameData(frameNumber), INPUT_VIDEO, null, props.scaling_factor_width, props.scaling_factor_height, fabricCanvas)
			return Promise.resolve(false)
		}

		const requestId = renderRequestRef.current + 1
		renderRequestRef.current = requestId

		return frameSource.getFrame(frameNumber).then((bitmap) => {
			if(renderRequestRef.current !== requestId){
				return false
			}

			let frameCanvas = frameCanvasRef.current
			if(!frameCanvas){
				frameCanvas = document.createElement('canvas')
				frameCanvasRef.current = frameCanvas
			}
			frameCanvas.width = frameSource.width
			frameCanvas.height = frameSource.height
			const context = frameCanvas.getContext('2d')
			context.clearRect(0, 0, frameCanvas.width, frameCanvas.height)
			context.drawImage(bitmap, 0, 0)
			canvasBackgroundUpdate(getSafeFrameData(frameNumber), INPUT_VIDEO, frameCanvas, props.scaling_factor_width, props.scaling_factor_height, fabricCanvas)
			frameSource.prefetchAround(frameNumber)
			return true
		}).catch((error) => {
			console.error(error)
			return false
		})
	}, [fabricCanvas, props.scaling_factor_height, props.scaling_factor_width, props.stream_num])

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

		temp_fabricCanvas.on('object:modified', function (event) {
			this.objDrag = true;
			const currentFrame = store.getState().current_frame['data']
            updateFrameData(currentFrame, temp_fabricCanvas.getObjects())
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
            if(this.objDrag){
				this.objDrag = false;
			}
			this.setViewportTransform(this.viewportTransform);
			this.isDragging = false;
			this.selection = true;
		});

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
			fabricCanvas.setDimensions({
				height: props.scaling_factor_height,
				width: props.scaling_factor_width,
			})
			fabricCanvas.renderAll()
		}
	}, [fabricCanvas, props.scaling_factor_height, props.scaling_factor_width])

	useEffect(() => {
		if(!fabricCanvas || !props.pendingBoundingBox){
			return
		}

		let isDrawing = false
		let originX = 0
		let originY = 0
		let previewRect = null
		const previousSelection = fabricCanvas.selection
		const previousCursor = fabricCanvas.defaultCursor

		fabricCanvas.discardActiveObject()
		fabricCanvas.selection = false
		fabricCanvas.defaultCursor = 'crosshair'
		fabricCanvas.forEachObject((object) => {
			object.selectable = false
		})
		fabricCanvas.requestRenderAll()

		const cleanupPreview = () => {
			if(previewRect){
				fabricCanvas.remove(previewRect)
				previewRect = null
			}
		}

		const finishDrawingMode = () => {
			fabricCanvas.selection = previousSelection
			fabricCanvas.defaultCursor = previousCursor
			fabricCanvas.forEachObject((object) => {
				object.selectable = true
			})
			fabricCanvas.requestRenderAll()
		}

		const handleMouseDown = (event) => {
			if(event.e.altKey){
				return
			}
			const pointer = fabricCanvas.getPointer(event.e)
			isDrawing = true
			originX = pointer.x
			originY = pointer.y
			previewRect = new fabric.Rect({
				left: originX,
				top: originY,
				originX: 'left',
				originY: 'top',
				width: 0,
				height: 0,
				fill: props.pendingBoundingBox.color,
				opacity: 0.28,
				stroke: props.pendingBoundingBox.color,
				strokeWidth: 2,
				selectable: false,
				evented: false,
			})
			fabricCanvas.add(previewRect)
		}

		const handleMouseMove = (event) => {
			if(!isDrawing || !previewRect){
				return
			}
			const pointer = fabricCanvas.getPointer(event.e)
			previewRect.set({
				left: Math.min(originX, pointer.x),
				top: Math.min(originY, pointer.y),
				width: Math.abs(originX - pointer.x),
				height: Math.abs(originY - pointer.y),
			})
			fabricCanvas.requestRenderAll()
		}

		const handleMouseUp = () => {
			if(!isDrawing || !previewRect){
				return
			}

			isDrawing = false
			const left = previewRect.left
			const top = previewRect.top
			const width = previewRect.width
			const height = previewRect.height
			cleanupPreview()

			if(width < 6 || height < 6){
				finishDrawingMode()
				props.onBoundingBoxCancelled?.()
				return
			}

			const boxData = new BoundingBox(top, left, width, height, props.pendingBoundingBox.color, props.pendingBoundingBox.id, "None").generate_no_behavior()
			fabric.util.enlivenObjects([boxData], function (enlivenedObjects){
				const boxObject = enlivenedObjects[0]
				boxObject.local_id = props.pendingBoundingBox.id
				boxObject.set({
					cornerColor: '#ffffff',
					cornerStrokeColor: '#111827',
					cornerSize: 10,
					transparentCorners: false,
					lockRotation: true,
					hasRotatingPoint: false,
				})
				fabricCanvas.add(boxObject)
				fabricCanvas.setActiveObject(boxObject)
				finishDrawingMode()
				updateFrameData(store.getState().current_frame['data'], fabricCanvas.getObjects())
				props.onBoundingBoxCreated?.(props.pendingBoundingBox)
			})
		}

		fabricCanvas.on('mouse:down', handleMouseDown)
		fabricCanvas.on('mouse:move', handleMouseMove)
		fabricCanvas.on('mouse:up', handleMouseUp)

		return () => {
			fabricCanvas.off('mouse:down', handleMouseDown)
			fabricCanvas.off('mouse:move', handleMouseMove)
			fabricCanvas.off('mouse:up', handleMouseUp)
			cleanupPreview()
			finishDrawingMode()
		}
	}, [fabricCanvas, props.pendingBoundingBox])

	useEffect(() => {
		if(!fabricCanvas || !props.pendingSegmentation){
			return
		}

		let points = []
		let pointMarkers = []
		let lineMarkers = []
		let previewLine = null
		let previewPolygon = null
		const previousSelection = fabricCanvas.selection
		const previousCursor = fabricCanvas.defaultCursor
		const previousHoverCursor = fabricCanvas.hoverCursor
		const previousObjectState = new Map()

		fabricCanvas.discardActiveObject()
		fabricCanvas.selection = false
		fabricCanvas.defaultCursor = 'crosshair'
		fabricCanvas.hoverCursor = 'crosshair'
		fabricCanvas.forEachObject((object) => {
			previousObjectState.set(object, {
				selectable: object.selectable,
				evented: object.evented,
			})
			object.selectable = false
			object.evented = false
		})
		fabricCanvas.requestRenderAll()

		const removeObject = (object) => {
			if(object){
				fabricCanvas.remove(object)
			}
		}

		const cleanupPreview = () => {
			removeObject(previewLine)
			removeObject(previewPolygon)
			pointMarkers.forEach(removeObject)
			lineMarkers.forEach(removeObject)
			previewLine = null
			previewPolygon = null
			pointMarkers = []
			lineMarkers = []
		}

		const finishDrawingMode = () => {
			fabricCanvas.selection = previousSelection
			fabricCanvas.defaultCursor = previousCursor
			fabricCanvas.hoverCursor = previousHoverCursor
			fabricCanvas.forEachObject((object) => {
				const previousState = previousObjectState.get(object)
				if(previousState){
					object.selectable = previousState.selectable
					object.evented = previousState.evented
				}
			})
			fabricCanvas.requestRenderAll()
		}

		const distanceFromFirstPoint = (pointer) => {
			if(points.length === 0){
				return Infinity
			}
			const firstPoint = points[0]
			return Math.hypot(pointer.x - firstPoint.x, pointer.y - firstPoint.y)
		}

		const updateFirstMarker = (isCloseTarget) => {
			if(pointMarkers.length === 0){
				return
			}
			pointMarkers[0].set({
				radius: isCloseTarget ? 7 : 5,
				fill: isCloseTarget ? '#f59e0b' : '#ffffff',
				stroke: isCloseTarget ? '#ffffff' : props.pendingSegmentation.color,
				strokeWidth: isCloseTarget ? 3 : 2,
			})
		}

		const updatePreviewPolygon = (pointer) => {
			removeObject(previewPolygon)
			previewPolygon = null
			if(points.length < 2){
				return
			}

			previewPolygon = new fabric.Polygon(points.concat([{ x: pointer.x, y: pointer.y }]), {
				stroke: props.pendingSegmentation.color,
				strokeWidth: 1,
				strokeDashArray: [5, 5],
				fill: props.pendingSegmentation.color,
				opacity: 0.18,
				selectable: false,
				evented: false,
				objectCaching: false,
			})
			fabricCanvas.add(previewPolygon)
			fabricCanvas.sendToBack(previewPolygon)
		}

		const addPoint = (pointer) => {
			const newPoint = { x: pointer.x, y: pointer.y }
			const previousPoint = points[points.length - 1]
			points.push(newPoint)

			if(previousPoint){
				const line = new fabric.Line([previousPoint.x, previousPoint.y, newPoint.x, newPoint.y], {
					stroke: props.pendingSegmentation.color,
					strokeWidth: 2,
					selectable: false,
					evented: false,
					objectCaching: false,
				})
				lineMarkers.push(line)
				fabricCanvas.add(line)
			}

			const marker = new fabric.Circle({
				left: newPoint.x,
				top: newPoint.y,
				radius: points.length === 1 ? 5 : 4,
				fill: points.length === 1 ? '#ffffff' : props.pendingSegmentation.color,
				stroke: points.length === 1 ? props.pendingSegmentation.color : '#ffffff',
				strokeWidth: 2,
				originX: 'center',
				originY: 'center',
				selectable: false,
				evented: false,
				objectCaching: false,
			})
			pointMarkers.push(marker)
			fabricCanvas.add(marker)

			removeObject(previewLine)
			previewLine = new fabric.Line([newPoint.x, newPoint.y, newPoint.x, newPoint.y], {
				stroke: props.pendingSegmentation.color,
				strokeWidth: 2,
				strokeDashArray: [4, 4],
				selectable: false,
				evented: false,
				objectCaching: false,
			})
			fabricCanvas.add(previewLine)
			fabricCanvas.requestRenderAll()
		}

		const completeSegmentation = () => {
			if(points.length < 3){
				return
			}

			const segmentPoints = points.map((point) => ({ x: point.x, y: point.y }))
			cleanupPreview()
			finishDrawingMode()
			const segmentationGroup = createSegmentationGroup(segmentPoints, props.pendingSegmentation.id, props.pendingSegmentation.color)
			fabricCanvas.add(segmentationGroup)
			fabricCanvas.setActiveObject(segmentationGroup)
			updateFrameData(store.getState().current_frame['data'], fabricCanvas.getObjects())
			props.onSegmentationCreated?.(props.pendingSegmentation)
		}

		const handleMouseDown = (event) => {
			if(event.e.altKey){
				return
			}

			const pointer = fabricCanvas.getPointer(event.e)
			if(points.length >= 3 && distanceFromFirstPoint(pointer) <= SEGMENT_CLOSE_RADIUS){
				completeSegmentation()
				return
			}

			addPoint(pointer)
		}

		const handleMouseMove = (event) => {
			if(points.length === 0){
				return
			}

			const pointer = fabricCanvas.getPointer(event.e)
			if(previewLine){
				previewLine.set({ x2: pointer.x, y2: pointer.y })
			}
			updateFirstMarker(points.length >= 3 && distanceFromFirstPoint(pointer) <= SEGMENT_CLOSE_RADIUS)
			updatePreviewPolygon(pointer)
			fabricCanvas.requestRenderAll()
		}

		fabricCanvas.on('mouse:down', handleMouseDown)
		fabricCanvas.on('mouse:move', handleMouseMove)

		return () => {
			fabricCanvas.off('mouse:down', handleMouseDown)
			fabricCanvas.off('mouse:move', handleMouseMove)
			cleanupPreview()
			finishDrawingMode()
		}
	}, [fabricCanvas, props.pendingSegmentation])

	useEffect(() => {
		if(!fabricCanvas || !props.deleteSelectedRequest || props.deleteSelectedRequest === lastDeleteRequestRef.current){
			return
		}

		lastDeleteRequestRef.current = props.deleteSelectedRequest
		const activeObject = fabricCanvas.getActiveObject()
		if(!activeObject || activeObject.type !== 'group'){
			return
		}

		const localId = activeObject.local_id || activeObject.item?.(1)?.text
		if(!localId){
			return
		}

		fabricCanvas.remove(activeObject)
		fabricCanvas.discardActiveObject()
		updateFrameData(store.getState().current_frame['data'], fabricCanvas.getObjects())
		props.onBoundingBoxDeleted?.(localId)
	}, [fabricCanvas, props.deleteSelectedRequest])

	useEffect(() => {
		if(fabricCanvas){
			if(play_redux){
				return;
			}
			// save_data(frameToUpdate, "frame_change")
			setFrameToUpdate(currframe_redux) 
			if(metadata_redux['media_type'] == INPUT_VIDEO){
				renderVideoFrame(currframe_redux)
			}else if (metadata_redux['media_type'] == INPUT_IMAGE){
				canvasBackgroundUpdate(getSafeFrameData(currframe_redux), INPUT_IMAGE, image_data[currframe_redux], props.scaling_factor_width, props.scaling_factor_height, fabricCanvas)
			}
		}
	}, [currFrame, fabricCanvas, play_redux, renderVideoFrame, props.scaling_factor_height, props.scaling_factor_width])

	useEffect(() => {
		if (upload==false){
			return
		}
		if(play_redux){
			save_data(store.getState().current_frame['data'], "play")
			if(metadata_redux['media_type'] == INPUT_VIDEO){
				const frameSource = getFrameSource(props.stream_num)
				const playbackSpeed = parseFloat(metadata_redux.playback_speed) || 1
				const baseFrameDelay = frameSource?.averageFrameRate ? 1000 / frameSource.averageFrameRate : 33
				const frameDelay = baseFrameDelay / playbackSpeed
				let cancelled = false
				const playFrames = async () => {
					while(!cancelled){
						const currentFrame = store.getState().current_frame['data']
						const frameStartedAt = performance.now()
						await renderVideoFrame(currentFrame)
						if(cancelled || currentFrame >= metadata_redux['total_frames'] - 1){
							return;
						}

						await sleep(Math.max(0, frameDelay - (performance.now() - frameStartedAt)))
						if(cancelled){
							return;
						}

						const nextFrame = Math.min(currentFrame + 1, metadata_redux['total_frames'] - 1)
						setCurrentFrame(nextFrame)
					}
				}
				playFrames()
				return () => {
					cancelled = true
				}
			}
		}
	}, [play_redux, upload, metadata_redux, renderVideoFrame])


	useEffect(() => {
		// We want to redraw when a annotation is added or removed. Unfortunately this also causes a redraw when the current frame is changed.
		// This is not ideal, but it is a good enough solution for now. This should NOT save the data.

		if(fabricCanvas && !play_redux){
			if(metadata_redux['media_type'] == INPUT_VIDEO){
				renderVideoFrame(currframe_redux)
			}else{
				canvasBackgroundUpdate(getSafeFrameData(currframe_redux), metadata_redux['media_type'], image_data[currframe_redux], props.scaling_factor_width, props.scaling_factor_height, fabricCanvas)
			}
		}
	}, [frame_redux, play_redux, renderVideoFrame, props.scaling_factor_height, props.scaling_factor_width])

	
	if(fabricCanvas != null && image_data != undefined && upload===false && play_redux===false){
		if(image_data.length > 0){
			if(metadata_redux['media_type'] == INPUT_VIDEO){
				setUpload(true)
			}else if(metadata_redux['media_type'] == INPUT_IMAGE){
				canvasBackgroundUpdate(getSafeFrameData(currframe_redux), INPUT_IMAGE, image_data[currframe_redux], props.scaling_factor_width, props.scaling_factor_height, fabricCanvas)
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
