import React from "react"; 
import 'bootstrap/dist/css/bootstrap.min.css';

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';

import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Button from 'react-bootstrap/Button'
import { FormControl } from "react-bootstrap";

import AnnotTable from './annot_table'
import SwapAnnotTable from "./cumulative_annot_table";

import store from '../../store'

function getAnnotationTableCount() {
    var annotation_data = store.getState().annotation_data.data
    var data = []
    if (!annotation_data){
        return data
    }
    for(var i = 0; i < annotation_data.length; i++){
        if(annotation_data[i].length !== 0){
            var txt_id = ""
            var txt_global = ""
            for(var j = 0; j < annotation_data[i].length; j++){
                txt_id += (annotation_data[i][j]['id']) + ', '
                txt_global += (annotation_data[i][j]['global_id']) + ', '
            }
            data.push({frame_num: i, anno_count: annotation_data[i].length, local_ids: txt_id, global_ids: txt_global})
        }
    }
    return data
}


export default function AnnotationTable(props){
    var annotation_data = (props.annotation_data)
    var columns = []
    var col = []
    var select_data = undefined
    if(store.getState().column_annot.data != undefined){
      col = store.getState().column_annot.data['columns']
      select_data = store.getState().column_annot.data['select_data']
      columns.push(col)//hookBypass(col)
    }
    const anno_col = React.useMemo(
        () => [
          {
            Header: 'Name',
            columns: [
              {
                Header: 'Frame',
                accessor: 'frame_num',
              },
              {
                Header: 'Count',
                accessor: 'anno_count',
              },
              {
                Header: 'Local ID',
                accessor: 'local_id',
              },
              {
                Header: 'Global ID',
                accessor: 'global_ids',
              },
              /*{
                Header: 'Swap',
                accessor: 'swap',
              }*/
            ],
          }
        ],
        []
      )

    //TODO Add in force option for user to upload some sort of config file to continue along to next steps.
    return (
        <div>
        {
            col.length != 0 &&
            <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
                <Tab eventKey="home" title="Current">
                    <AnnotTable columns={columns} data={annotation_data} select_data={select_data} current_frame={props.currentFrame} change_annot={props.handleChangeAnnot}/>
                </Tab>

            </Tabs>
        }   
        </div>
           
    )
}
/*
                <Tab eventKey="swap" title="Swap">
                    <SwapAnnotTable columns={anno_col} data={getAnnotationTableCount()}></SwapAnnotTable>
                </Tab>
*/
/*
<Tab eventKey="profile" title="Previous">
                <BootstrapTable
                    keyField='frame_num'
                    data={data} 
                    columns={anno_col((props.handleSetCurrentFrame))}
                    table
                    noDataIndication={ () => <div>No recorded annotations or behaviors for this video.</div> }
                    pagination={ paginationFactory() }
                />
            </Tab>
*/