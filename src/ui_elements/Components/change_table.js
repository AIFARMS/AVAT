import React, { useState } from "react"; 
import ReactDOM from 'react-dom'
import ReactPlayer from 'react-player'
import 'bootstrap/dist/css/bootstrap.min.css';

import Table from 'react-bootstrap/Table'

import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const columns = [{
    dataField: "id",
    text: "ID"
},{
    dataField: "behavior",
    text: "Behavior"
},{
    dataField: "is_hidden",
    text: "Hidden"
}]

function json_to_table(data){
    var ret = []
    if(data == null){
        return []
    }
    console.log(data['objects'])
    for(var i = 0; i < data['objects'].length; i++){
        var curr = []
        const elem_id = i + 1
        curr.push({id: parseInt(elem_id), behavior: "None", is_hidden: "False"})        
        ret.push(curr)
    }
    console.log(ret)
    return ret
}

function ChangeTable(input){
    //console.log(input.data)
    const data = json_to_table(input.data)
    return (
        <div style={{width: "15%"}}>
            <BootstrapTable condensed={true} keyField='id' data={data} columns={ columns } />
        </div>
    )
}

export default ChangeTable;