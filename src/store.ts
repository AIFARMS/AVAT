import { configureStore } from '@reduxjs/toolkit'
import frameDataSlice from './reducer/frame_data'
import annotationDataSlice from './reducer/annotation_data'
import columnDataSlice from './reducer/column_annot'
import currFrameDataSlice from './reducer/current_frame'
import mediaDataSlice from './reducer/media_data'
import metadataSlice from './reducer/metadata'
import playStatusSlice from './reducer/play_status'

const store = configureStore({
  reducer: {
    frame_data: frameDataSlice,
    annotation_data: annotationDataSlice,
    column_annot: columnDataSlice,
    current_frame: currFrameDataSlice,
    media_data: mediaDataSlice,
    metadata: metadataSlice,
    play_status: playStatusSlice,
  },
  devTools: import.meta.env.MODE !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
