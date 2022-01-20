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
        init(state, payload){
            console.log(payload.payload)
            var data = [];
            for(var i = 0; i < payload.payload; i++){
                data.push([]);
            }
            state.data = data;
        },
        modifyFrame(state, payload){
            console.log(payload.payload)
            var temp = state.data
            temp[payload.payload.currentFrame] = payload.payload.data
            state.data = temp
        },

    }
})

export const {init, modifyFrame} = frameDataSlice.actions
export default frameDataSlice.reducer