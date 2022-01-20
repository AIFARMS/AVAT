import {INIT_FRAME, MODIFY_FRAME, REFRESH_FRAME} from './action_types'

/*
Note:
'type' -> REQUIRED
..args -> Optional (If you have data that needs to be sent, it needs to be in here)
*/

export function initFrame(frame_count){
    return {
        type: INIT_FRAME,
        frame_count
    }
}

export function modifyFrame(current_frame, current_frame_data){
    return {
        type: MODIFY_FRAME,
        current_frame,
        current_frame_data
    }
}

export function refreshFrame(){
    return {
        type: REFRESH_FRAME,
        payload
    }
}
