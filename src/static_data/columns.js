import React from "react"; 
import {behaviors} from './behaviors'
import {posture} from './posture'
import {status} from './status'
import {confidence} from './confidence'
import { Button } from '@/components/ui/button'

const SELECT_EDITOR = 'select'

const columns = (remove_table_index) => [{
  dataField: "id",
  text: "ID",
  headerStyle: () => { return { width: "40px", left: 0 }; },
  editable: false,
},{
  dataField: "global_id",
  text: "Glo",
  headerStyle: () => { return { width: "70px", left: 0}; }
},{
  dataField: "posture",
  text: "Posture",
  editor: {
      type: SELECT_EDITOR,
      options: posture,
  }
},
{
  dataField: "behavior",
  text: "Behavior",
  editor: {
      type: SELECT_EDITOR,
      options: behaviors,
  }
},{
  dataField: "confidence",
  text: "Confidence",
  editor: {
      type: SELECT_EDITOR,
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
        variant="destructive"
        size="xs"
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
          variant="destructive"
          size="xs"
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
 
