import {behaviors} from './behaviors'
import {posture} from './posture'
import {status} from './status'

const SELECT_EDITOR = 'select'

const columns = [{
  dataField: "id",
  text: "ID"
},{
  dataField: "global_id",
  text: "Glo"
},{
  dataField: "status",
  text: "Status",
  editor: {
      type: SELECT_EDITOR,
      options: status
    }
},{
  dataField: "is_hidden",
  text: "Hid"
},{
  dataField: "Behavior",
  text: "Pos",
  editor: {
      type: SELECT_EDITOR,
      options: posture
    }
}]

export {columns}
