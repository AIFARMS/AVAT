import React from "react"; 

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AnnotTable from './annot_table'

import store from '../../store'


export default function AnnotationTable(props){
    var annotation_data = (props.annotation_data)
    var columns = []
    var select_data = undefined
    if(store.getState().column_annot.data != undefined){
      columns = store.getState().column_annot.data['columns'] || []
      select_data = store.getState().column_annot.data['select_data']
    }

    //TODO Add in force option for user to upload some sort of config file to continue along to next steps.
    return (
        <div>
        {
            columns.length != 0 &&
            <Tabs defaultValue="home">
                <TabsList>
                    <TabsTrigger value="home">Current</TabsTrigger>
                </TabsList>
                <TabsContent value="home">
                    <AnnotTable columns={columns} data={annotation_data} select_data={select_data} current_frame={props.currentFrame} change_annot={props.handleChangeAnnot}/>
                </TabsContent>

            </Tabs>
        }   
        </div>
           
    )
}
