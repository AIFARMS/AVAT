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
		setMedia}