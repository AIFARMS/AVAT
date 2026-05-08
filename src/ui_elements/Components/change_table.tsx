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
        <div className="flex h-full min-h-0 flex-col">
        {
            columns.length != 0 &&
            <Tabs defaultValue="home" className="h-full min-h-0 gap-0">
                <TabsList className="m-3 mb-0">
                    <TabsTrigger value="home">Current</TabsTrigger>
                </TabsList>
                <TabsContent value="home" className="min-h-0 overflow-hidden p-3">
				<AnnotTable columns={columns} data={annotation_data} select_data={select_data} current_frame={props.currentFrame} change_annot={props.handleChangeAnnot} selected_annotation_id={props.selectedAnnotationId}/>
			</TabsContent>

            </Tabs>
        }   
        </div>
           
    )
}
