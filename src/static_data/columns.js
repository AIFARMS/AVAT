import { Type } from 'react-bootstrap-table2-editor';
import {behaviors} from '../../static_data/behaviors'
import {posture} from '../../static_data/posture'

const columns = [{
    dataField: "id",
    text: "ID"
  },{
    dataField: "global_id",
    text: "Glo"
  },{
    dataField: "behavior",
    text: "Beh",
    editor: {
        type: Type.SELECT,
        options: behaviors
      }
  },{
    dataField: "is_hidden",
    text: "Hid"
  },{
    dataField: "posture",
    text: "Pos",
    editor: {
        type: Type.SELECT,
        options: posture
      }
  }]

export {columns}