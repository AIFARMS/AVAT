import React from "react"; 
import { Type } from 'react-bootstrap-table2-editor';
import {behaviors} from './behaviors'
import {posture} from './posture'
import {status} from './status'
import {confidence} from './confidence'
import Button from 'react-bootstrap/Button'

const columns = (remove_table_index) => [{
  dataField: "id",
  text: "ID",
  headerStyle: () => { return { width: "40px", left: 0 }; },
  editable: false,
},{
  dataField: "global_id",
  text: "Glo",
  headerStyle: () => { return { width: "50px", left: 0}; },
  editCellStyle: (cell, row, rowIndex, colIndex) => {
    const backgroundColor = cell > 2101 ? '#00BFFF' : '#00FFFF';
    return { backgroundColor };
  }
},{
  dataField: "posture",
  text: "Posture",
  editor: {
      type: Type.SELECT,
      options: posture,
  }
},
{
  dataField: "behavior",
  text: "Behavior",
  editor: {
      type: Type.SELECT,
      options: behaviors,
  }
},{
  dataField: "confidence",
  text: "Confidence",
  editor: {
      type: Type.SELECT,
      options: confidence,
  }
},{
  dataField: "remove",
  text: "Del",
  editable: false,
  headerStyle: () => { return { width: "50px", left: 0}; },
  headerFormatter: () => {return (
    <div>
      Del
      <Button
        className="btn btn-danger btn-xs"
        onClick={() => remove_table_index()}
        label="Del"
      >
      </Button>
    </div>
  );},
  formatter: (cellContent, row) => {
    return (
      <div>        
        <Button
          className="btn btn-danger btn-xs"
            onClick={() => remove_table_index(row.id)}
            label="Del"
          >
        </Button>
      </div>
    );
  },
}
]
export {columns}
 
