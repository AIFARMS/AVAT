import React, { useState } from "react"; 
import 'bootstrap/dist/css/bootstrap.min.css';

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';

import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'


export default function AnnotationTable(props){
    //console.log(input.data)
    return (
        <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
        <Tab eventKey="home" title="Current">
            <BootstrapTable
                keyField='id'
                data={props.annotation_data[props.currentFrame]} 
                columns={props.columns(props.remove_table_index)}
                table
                noDataIndication={ () => <div>No recorded annotations or behaviors for this frame<br/>Please add an annotation or behavior tag to start.</div> }
                cellEdit={
                cellEditFactory({ mode: 'click', blurToSave: true,
                    afterSaveCell: (oldValue, newValue, row, column) => {
                        props.annotation_data[props.currentFrame][row['id']] = row
                        props.changeKeyCheck(true)
                    },
                    onStartEdit: (row, column, rowIndex, columnIndex) => {
                        props.changeKeyCheck(false)
                    }
                }) 
                }
                pagination={ paginationFactory() }
            />
        </Tab>
        <Tab eventKey="profile" title="Previous">
            {"Prev Annotated frames will go here :)\n In Progress!"}
        </Tab>
    </Tabs>
    )
}
