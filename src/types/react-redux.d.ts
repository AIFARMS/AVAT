import 'react-redux';

declare module 'react-redux' {
  interface DefaultRootState {
    frame_data: any;
    annotation_data: any;
    column_annot: any;
    current_frame: any;
    media_data: any;
    metadata: any;
    play_status: any;
  }
}
