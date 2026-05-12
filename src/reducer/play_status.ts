import {createSlice} from '@reduxjs/toolkit'

const initialState = {play: false}

const playStatusSlice = createSlice({
    name: 'play_status',
    initialState,
    reducers:{
        init(state, payload){
            state.play = false;
        },
        togglePlay(state, payload){
            state.play = !state.play
        }
    }
})

export const {init, togglePlay} = playStatusSlice.actions
export default playStatusSlice.reducer
