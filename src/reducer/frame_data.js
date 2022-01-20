import { data } from 'jquery'
import {INIT_FRAME, MODIFY_FRAME, REFRESH_FRAME} from '../action/action_types'
import {createSlice} from '@reduxjs/toolkit'

const initialState = {data: []}
/* 
export const frame_data = (state = initial_frame_data, action) => {
    switch (action.type){
        case INIT_FRAME: {
            data = []
            for(var i = 0; i < action.payload; i++){
                data.push([])
            }
            return data
        }``
        case MODIFY_FRAME:
            return 
    }
} */

const frameDataSlice = createSlice({
    name: 'frame_data',
    initialState,
    reducers:{
        init(state, frame_count){
            var data = [];
            for(var i = 0; i < frame_count; i++){
                data.push([]);
            }
            state.data = data;
        },
        modifyFrame(state, currentFrame, data){
            var temp = state.data
            temp[currentFrame] = data
            state.data = temp
        },

    }
})

export const {init, modifyFrame} = frameDataSlice.actions
export default frameDataSlice.reducer