import React from 'react'

import { useTable, usePagination } from 'react-table'
import {confidence, behaviors, posture} from '../../static_data/combined_dat'

export default function AnnotTable({columns, data}){
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
                    var selection = genSelection(row.original)
                    console.log(selection)
                    return(selection)
                })}
            </tbody>
        </table>
    )
}

function genSelection(elem){
    let behaviors_temp = (
        <select defaultValue={elem.behavior}>
            <option value=""></option>
            {
                behaviors.map((beh, i) => {
                    return(
                        <option value={beh.value}>{beh.value}</option>
                    )
                })
            }
        </select>
    )

    let confidence_temp = (
        <select defaultValue={elem.confidence}>
            <option value=""></option>
            {
                confidence.map((beh, i) => {
                    return(
                        <option value={beh.value}>{beh.value}</option>
                    )
                })
            }
        </select>
    )

    let posture_temp = (
        <select defaultValue={elem.posture}>
            <option value=""></option>
            {
                posture.map((beh, i) => {
                    return(
                        <option value={beh.value}>{beh.value}</option>
                    )
                })
            }
        </select>
    )

    let coombined = (
        <tr key={elem.id}>
            <td>{elem.id}</td>
            <td>{elem.global_id}</td>
            <td>{posture_temp}</td>
            <td>{behaviors_temp}</td>
            <td>{confidence_temp}</td>
        </tr>
    )
    return coombined
}