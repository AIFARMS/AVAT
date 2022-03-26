import { configureStore } from '@reduxjs/toolkit'
import frameDataSlice from './reducer/frame_data'
import annotationDataSlice from './reducer/annotation_data'
import columnDataSlice from './reducer/column_annot'
import currFrameDataSlice from './reducer/current_frame'

export default configureStore({
  reducer: {
    frame_data: frameDataSlice,
    annotation_data: annotationDataSlice,
    column_annot: columnDataSlice,
    current_frame: currFrameDataSlice
  },
})