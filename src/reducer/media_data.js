import {createSlice} from '@reduxjs/toolkit'

const initialState = {data: []}

const mediaDataSlice = createSlice({
    name: 'media_data',
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
        addMedia(state, payload){
            state.data = payload.payload
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false
        })
    }
})

export const {init, modifyFrame} = mediaDataSlice.actions
export default mediaDataSlice.reducer