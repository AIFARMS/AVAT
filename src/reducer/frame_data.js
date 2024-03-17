import {createSlice} from '@reduxjs/toolkit'

const initialState = {data: []}

const frameDataSlice = createSlice({
    name: 'frame_data',
    initialState,
    reducers:{
        init(state, payload){
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
            var temp = state.data
            temp[payload.payload.currentFrame] = payload.payload.data
            state.data = temp
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false
        })
    }
})

export const {init, modifyFrame} = frameDataSlice.actions
export default frameDataSlice.reducer
