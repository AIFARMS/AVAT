import {createSlice} from '@reduxjs/toolkit'

const initialState = {data: []}

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
        initOldAnnotation(state, payload){
            state.data = payload.payload
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