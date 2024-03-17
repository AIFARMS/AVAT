import {createSlice} from '@reduxjs/toolkit'
import {initFrameData, updateFrameData, getFrameData, initAnnotationData, updateAnnotationData, getAnnotationData, initColumnData, setMedia, initMedia} from '../processing/actions'


const initialState = {horizontal_res: 0, vertical_res: 0, frame_rate: 1, media_type: "in_video", total_frames: 0, skip_value: 1}

const metadataSlice = createSlice({
    name: 'metadata',
    initialState,
    reducers:{
        init(state, payload){
            state.horizontal_res = payload.payload.horizontal_res
            state.vertical_res = payload.payload.vertical_res
            state.frame_rate = payload.payload.frame_rate
            state.media_type = payload.payload.media_type
            state.total_frames = payload.payload.total_frames
        },
        setRes(state, payload){
            state.horizontal_res = payload.payload.horizontal_res
            state.vertical_res = payload.payload.vertical_res
        },
        setFrameRate(state, payload){
	    // When the frame rate is changed, we first calculate the current frame rate and then multiply the total frames by the ratio of the new frame rate to the old frame rate
	    if (state.media_type != "in_image") { // only for videos
		    var curr_framerate =  JSON.parse(JSON.stringify(state))['frame_rate']
		    state.total_frames = state.total_frames / curr_framerate
		    state.total_frames = state.total_frames * payload.payload.frame_rate
		    state.frame_rate = payload.payload.frame_rate
	    }
        },
        setMediaType(state, payload){
            state.media_type = payload.payload.media_type
        },
        setTotalFrames(state, payload){
            state.total_frames = payload.payload.total_frames
        },
        setSkipValue(state, payload){
            state.skip_value = payload.payload.skip_value
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false
        })
    }
})

export const {init, setRes, setFrameRate, setMediaType, setTotalFrames, setSkipValue} = metadataSlice.actions
export default metadataSlice.reducer
