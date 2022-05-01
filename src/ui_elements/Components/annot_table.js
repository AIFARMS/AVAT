import React from 'react'
import {initFrameData, updateFrameData, getFrameData, initAnnotationData, updateAnnotationData, getAnnotationData} from '../../processing/actions'

import { useTable, usePagination } from 'react-table'

export default function AnnotTable({columns, data, select_data, current_frame, change_annot}){
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({
        columns,
        data,
      })
      if(!columns){
        return (
            <div>
                {"No column upload detected."}
            </div>
        )
    }

    return(
        <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
            <thead>
                {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()} 
                    style={{
                      background: '#657',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>{column.render('Header')}</th>
                    ))}
                </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    const {id, global_id, posture, behavior, confidence} = row
                    var selection = genSelection(row.original, select_data, columns, i, current_frame)
                    return(selection)
                })}
            </tbody>
        </table>
    )
}

const change_row = (e) => {
    var curr_data = getAnnotationData(e.target.dataset.curr)
    if (curr_data.length === 0){
        alert("Row changing value failed - please report this bug.")
        return;
    }
    curr_data[e.target.id][e.target.dataset.type] = e.target.value
    updateAnnotationData(parseInt(e.target.dataset.curr), curr_data)
}

const delete_row = (e) => {
    var curr_data = getAnnotationData(e.target.dataset.curr)
    if (curr_data.length === 0){
        alert("Row deletion failed - please report this bug.")
        return;
    }
    var annot_delte = curr_data[e.target.id]['id']
    console.log(annot_delte)
    curr_data.splice(e.target.id, 1)
    updateAnnotationData(parseInt(e.target.dataset.curr), curr_data)
    var curr_img_data = getFrameData(e.target.dataset.curr)
    for(var i = 0; i < curr_img_data.length; i++){
        if(curr_img_data[i].objects[1].text == annot_delte){
            curr_img_data.splice(i, 1)
        }
    }
    updateFrameData(parseInt(e.target.dataset.curr), curr_img_data)
}

function genSelection(elem, select_data, columns, curr_idx, current_frame){
    var row_vals = []
    console.log(current_frame)
    for(var i = 0; i < columns[0].columns.length; i++){
        var curr_elem = columns[0].columns[i]['accessor']
        if(!check_keys(select_data, curr_elem)){
            continue
        }
        let temp = (
            <select id={curr_idx} data-type={curr_elem} data-curr={current_frame} defaultValue={elem[curr_elem]} onChange={change_row}>
                <option value=""></option>
                {
                    select_data[curr_elem].map((beh, _) => {
                        return(
                            <option value={beh.value}>{beh.value}</option>
                        )
                    })
                }
            </select>
        )
        row_vals.push(temp)
    }
    
    let combined_elems = (
        <tr key={elem.id}>
            <td>{elem.id}</td>
            <td>
                <input type={"text"} style={{width: "50%"}} defaultValue={elem.global_id} id={curr_idx} data-type={"global_id"} data-curr={current_frame} onChange={change_row}></input>
            </td>
            {
                row_vals.map((i, j) => {
                    return(<td id={j}>{i}</td>)
                })
            }
            <td>
                <input type={"button"} style={{backgroundColor: "#f44336"}} defaultValue={elem.global_id} id={curr_idx} data-type={"global_id"} data-curr={current_frame} onClick={delete_row}></input>
            </td>
        </tr>
    )
    return combined_elems
}

function check_keys(obj, key){
    let obj_keys = Object.keys(obj)
    for(var i = 0; i < obj_keys.length; i++){
        if(obj_keys[i] === key){
            return true
        }
    }
    return false
}
