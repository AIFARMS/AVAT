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

export {initFrameData, updateFrameData, getFrameData, initAnnotationData, updateAnnotationData, getAnnotationData, initColumnData, getColumnData}