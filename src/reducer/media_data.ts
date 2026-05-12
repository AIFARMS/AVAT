import {createSlice} from '@reduxjs/toolkit'

const initialState = {data: []}

const mediaDataSlice = createSlice({
    name: 'media_data',
    initialState,
reducers:{
        init(state, payload){
            var data = [];
            for(var i = 0; i < payload.payload; i++){
                data.push([]);
            }
            state.data = data;
        },
        addMedia(state, payload){
            var temp = state.data
            var media = payload.payload.media
            temp[payload.payload.stream_num] = media
            state.data = temp
        }
    }
})

export const {init, addMedia} = mediaDataSlice.actions
export default mediaDataSlice.reducer
