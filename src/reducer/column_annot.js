import {createSlice} from '@reduxjs/toolkit'

const initialState = {data: undefined}

const columnDataSlice = createSlice({
    name: 'column_annot',
    initialState,
    reducers:{
        init(state, payload){
            console.log(payload.payload.data)
            state.data = payload.payload.data
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false
        })
    }
})

export const {init} = columnDataSlice.actions
export default columnDataSlice.reducer