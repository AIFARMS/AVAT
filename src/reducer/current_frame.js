import {createSlice} from '@reduxjs/toolkit'

const initialState = {data: undefined}

const currFrameDataSlice = createSlice({
    name: 'current_frame',
    initialState,
    reducers:{
        init(state, payload){
            console.log(payload.payload.data)
            state.data = payload.payload.data
        },
        changeFrame(state, payload){
            state.data = payload.payload.data
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false
        })
    }
})

export const {init} = currFrameDataSlice.actions
export default currFrameDataSlice.reducer