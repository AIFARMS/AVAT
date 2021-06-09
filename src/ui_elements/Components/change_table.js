import React, { useState } from "react"; 
import 'bootstrap/dist/css/bootstrap.min.css';

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import {behaviors} from '../../static_data/behaviors'
import {posture} from '../../static_data/posture'

const columns = [{
    dataField: "id",
    text: "ID"
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
        options: {posture}
      }
}]

function json_to_table(data){
    var ret = []
    if(data == null){
        return []
    }
    for(var i = 0; i < data['objects'].length; i++){
        const elem_id = i + 1
        var curr_obj = data['objects'][i]
        console.log(curr_obj['left'])
        ret.push({id: elem_id.toString(), behavior: "None", is_hidden: "False", posture: "None"})        
    }
    return ret
}

function ChangeTable(input){
    //console.log(input.data)
    const data = json_to_table(input.data)
    return (
        <div style={{width: "15%"}}>
            <BootstrapTable condensed={true} keyField='id' data={data} columns={ columns } cellEdit={ cellEditFactory({ mode: 'click', blurToSave: true }) }/>
        </div>
    )
}

export default ChangeTable;