import store from '../store'

/*
Action functions for frame_data
*/
function initFrameData(frame_count){
	store.dispatch({
		type: "frame_data/init",
		payload: frame_count
	})
}
function updateFrameData(frame_number, data){
	store.dispatch({
		type: "frame_data/modifyFrame",
		payload: {currentFrame: frame_number, data: data}
	})
}
function getFrameData(frame_number){
	return JSON.parse(JSON.stringify(store.getState().frame_data.data[frame_number]))
} 

/*
Action functions for annotation_data
*/
function initAnnotationData(frame_count){
    store.dispatch({
		type: "annotation_data/init",
		payload: frame_count
	})
}
function updateAnnotationData(frame_number, data){
    store.dispatch({
		type: "annotation_data/modifyFrame",
		payload: {currentFrame: frame_number, data: data}
	})
}
function getAnnotationData(frame_number){
    return JSON.parse(JSON.stringify(store.getState().annotation_data.data[frame_number]))
}

/*
Action functions for column uploading
*/
function initColumnData(column_dat){
	store.dispatch({
		type: "column_annot/init",
		payload: {data: column_dat}
	})
}

function getColumnData(){
	return JSON.parse(JSON.stringify(store.getState().column_annot))
}

function initCurrentFrame(frame_num){
	store.dispatch({
		type: "current_frame/init",
		payload: {data: frame_num}
	})
}

function getCurrentFrame(){
	return JSON.parse(JSON.stringify(store.getState().current_frame))['data']
}

function setCurrentFrame(frame_num){
	store.dispatch({
		type: "current_frame/changeFrame",
		payload: {data: frame_num}
	})
}

function initMedia(num_streams){
	store.dispatch({
		type: "media_data/init",
		payload: num_streams
	})
}

function setMedia(stream_num, media){
	store.dispatch({
		type: "media_data/addMedia",
		payload: {stream_num: stream_num, media: media}
	})
}

function initMetadata(horizontal_res, vertical_res, frame_rate, media_type, total_frames){
	store.dispatch({
		type: "metadata/init",
		payload: {horizontal_res: horizontal_res, vertical_res: vertical_res, frame_rate: frame_rate, media_type: media_type, total_frames: total_frames}
	})
}

function setRes(horizontal_res, vertical_res){
	store.dispatch({
		type: "metadata/setRes",
		payload: {horizontal_res: horizontal_res, vertical_res: vertical_res}
	})
}

function setFrameRate(frame_rate){
	store.dispatch({
		type: "metadata/setFrameRate",
		payload: {frame_rate: frame_rate}
	})
}

function setMediaType(media_type){
	store.dispatch({
		type: "metadata/setMediaType",
		payload: {media_type: media_type}
	})
}

function setTotalFrames(total_frames){
	store.dispatch({
		type: "metadata/setTotalFrames",
		payload: {total_frames: total_frames}
	})
}

function setSkipValue(skip_val){
	store.dispatch({
		type: "metadata/setSkipValue",
		payload: {skip_value: skip_val}
	})
}

function getMetaData(){
	return JSON.parse(JSON.stringify(store.getState().metadata))
}

export {initFrameData, 
		updateFrameData, 
		getFrameData, 
		initAnnotationData, 
		updateAnnotationData, 
		getAnnotationData, 
		initColumnData, 
		getColumnData,
		initCurrentFrame,
		getCurrentFrame,
		setCurrentFrame,
		initMedia,
		setMedia, 
		initMetadata,
		setRes, 
		setFrameRate,
		setMediaType,
		setTotalFrames,
		setSkipValue,
		getMetaData}