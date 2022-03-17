import React from 'react'

import { useTable, usePagination } from 'react-table'

export default function AnnotTable({columns, data, select_data}){
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
                    var selection = genSelection(row.original, select_data, columns)
                    return(selection)
                })}
            </tbody>
        </table>
    )
}

function genSelection(elem, select_data, columns){
    var row_vals = []
    
    for(var i = 0; i < columns[0].columns.length; i++){
        var curr_elem = columns[0].columns[i]['accessor']
        if(!check_keys(select_data, curr_elem)){
            continue
        }
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
    
    let combined_elems = (
        <tr key={elem.id}>
            <td>{elem.id}</td>
            <td>
                <input type={"text"} style={{width: "50%"}} defaultValue={elem.global_id}></input>
            </td>
            {
                row_vals.map((i, j) => {
                    return(<td id={j}>{i}</td>)
                })
            }
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

function cell_edit(rowIndex, columnId, value){
    console.log(rowIndex)
    console.log(columnId)
    console.log(value)
}

const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData,
}) => {
    const [value, setValue] = React.useState(initialValue)
    const onChange = e => {
        setValue(e.target.value)
    }

    const onBlur = () => {
        updateMyData(index, id, value)
    }

    React.useEffect(() => {
        setValue(initialValue)
      }, [initialValue])
    
      return <input value={value} onChange={onChange} onBlur={onBlur} />
}

const defaultColumn = {
    Cell: EditableCell,
}