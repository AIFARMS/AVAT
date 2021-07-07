import React from "react"; 
import { Type } from 'react-bootstrap-table2-editor';
import {behaviors} from './behaviors'
import {posture} from './posture'
import {status} from './status'
import Button from 'react-bootstrap/Button'

const columns = (remove_table_index) => [{
  dataField: "id",
  text: "ID",
  headerStyle: () => { return { width: "40px", left: 0 }; }
},{
  dataField: "global_id",
  text: "Glo",
  headerStyle: () => { return { width: "50px", left: 0}; },
  editCellStyle: (cell, row, rowIndex, colIndex) => {
    const backgroundColor = cell > 2101 ? '#00BFFF' : '#00FFFF';
    return { backgroundColor };
  }
},{
  dataField: "status",
  text: "Status",
  editor: {
      type: Type.SELECT,
      options: status
    }
},{
  dataField: "current",
  text: "Curr",
  editor: {
    type: Type.CHECKBOX,
    value: 'Start:Stop'
  },
  headerStyle: () => { return { width: "60px", left: 0}; },
},{
  dataField: "behavior",
  text: "Behavior",
  editor: {
      type: Type.SELECT,
      options: behaviors,
  }
},
{
  dataField: "posture",
  text: "Posture",
  editor: {
      type: Type.SELECT,
      options: posture,
  }
},{
  dataField: "remove",
  text: "Del",
  editable: false,
  headerStyle: () => { return { width: "50px", left: 0}; },
  formatter: (cellContent, row) => {
    return (
      <Button
        className="btn btn-danger btn-xs"
          onClick={() => remove_table_index(row.id)}
          label="Del"
        >
      </Button>
    );
  },
}
]
export {columns}