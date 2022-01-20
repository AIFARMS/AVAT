import { configureStore } from '@reduxjs/toolkit'
import frameDataSlice from './reducer/frame_data'

export default configureStore({
  reducer: {
    frame_data: frameDataSlice
  },
})