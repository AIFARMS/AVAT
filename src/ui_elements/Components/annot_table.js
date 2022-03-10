import React from 'react'

import { useTable, usePagination } from 'react-table'
import {confidence, behaviors, posture} from '../../static_data/combined_dat'

export default function AnnotTable({columns, data, select_data}){
    console.log(columns)

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
    console.log(data)
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
                    var selection = genSelection(row.original, select_data, columns)
                    console.log(selection)
                    return(selection)
                })}
            </tbody>
        </table>
    )
}

function genSelection(elem, select_data, columns){
    var row_vals = []
    console.log(elem)
    console.log(select_data)
    console.log(columns)
    
    for(var i = 0; i < columns[0].columns.length; i++){
        var curr_elem = columns[0].columns[i]['accessor']
        if(!check_keys(select_data, curr_elem)){
            continue
        }
        console.log(curr_elem)
        console.log(elem[curr_elem])
        console.log(select_data[curr_elem])
        let temp = (
            <select defaultValue={elem[curr_elem]}>
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
    
    let coombined = (
        <tr key={elem.id}>
            <td>{elem.id}</td>
            <td>{elem.global_id}</td>
            {
                row_vals.map((i, j) => {
                    return(<td>{i}</td>)
                })
            }
        </tr>
    )
    return coombined
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