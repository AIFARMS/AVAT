import { Type } from 'react-bootstrap-table2-editor';
import {behaviors} from './behaviors'
import {posture} from './posture'
import {status} from './status'

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
      type: Type.SELECT,
      options: status
    }
},{
  dataField: "is_hidden",
  text: "Hid"
},{
  dataField: "Behavior",
  text: "Pos",
  editor: {
      type: Type.SELECT,
      options: posture
    }
}]

export {columns}