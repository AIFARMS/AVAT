import React from 'react'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { getFrameData, getAnnotationData, updateAnnotationData, updateFrameData } from '../../processing/actions'

export default function AnnotTable({columns, data, select_data, current_frame}){
    const tableColumns = React.useMemo(
        () => withAnnotationCells(columns || [], select_data || {}, current_frame),
        [columns, select_data, current_frame]
    )

    const table = useReactTable({
        columns: tableColumns,
        data: data || [],
        getCoreRowModel: getCoreRowModel(),
    })

    if(!columns || columns.length === 0){
        return (
            <div className="rounded-md border p-3 text-sm text-muted-foreground">
                No column upload detected.
            </div>
        )
    }

    return(
        <Table className="border">
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead key={header.id} className="bg-zinc-700 text-white">
                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

function withAnnotationCells(columns, selectData, currentFrame){
    return columns.map((column) => {
        if(column.columns){
            return {
                ...column,
                columns: withAnnotationCells(column.columns, selectData, currentFrame),
            }
        }

        const columnId = column.accessorKey || column.id
        return {
            ...column,
            cell: column.cell || ((context) => renderAnnotationCell(context, columnId, selectData, currentFrame)),
        }
    })
}

function renderAnnotationCell({ row, getValue }, columnId, selectData, currentFrame){
    const rowIndex = row.index
    const value = getValue() || ''

    if(columnId === 'id'){
        return value
    }

    if(columnId === 'remove'){
        return (
            <Button
                type="button"
                variant="destructive"
                size="xs"
                onClick={() => deleteRow(currentFrame, rowIndex)}
            >
                Del
            </Button>
        )
    }

    if(selectData[columnId]){
        return (
            <NativeSelect
                size="sm"
                defaultValue={value}
                onChange={(event) => updateCell(currentFrame, rowIndex, columnId, event.target.value)}
            >
                <NativeSelectOption value=""></NativeSelectOption>
                {selectData[columnId].map((option) => (
                    <NativeSelectOption key={option.value} value={option.value}>{option.value}</NativeSelectOption>
                ))}
            </NativeSelect>
        )
    }

    return (
        <Input
            className="h-7 min-w-24"
            defaultValue={value}
            onChange={(event) => updateCell(currentFrame, rowIndex, columnId, event.target.value)}
        />
    )
}

function updateCell(currentFrame, rowIndex, columnId, value){
    var curr_data = getAnnotationData(currentFrame)
    if (curr_data.length === 0){
        alert("Row changing value failed - please report this bug.")
        return
    }
    curr_data[rowIndex][columnId] = value
    updateAnnotationData(parseInt(currentFrame), curr_data)
}

function deleteRow(currentFrame, rowIndex){
    var curr_data = getAnnotationData(currentFrame)
    if (curr_data.length === 0){
        alert("Row deletion failed - please report this bug.")
        return
    }
    var annot_delete = curr_data[rowIndex]['id']
    curr_data.splice(rowIndex, 1)
    updateAnnotationData(parseInt(currentFrame), curr_data)

    var curr_img_data = getFrameData(currentFrame)
    for(var i = 0; i < curr_img_data.length; i++){
        if(curr_img_data[i].objects[1].text == annot_delete){
            curr_img_data.splice(i, 1)
        }
    }
    updateFrameData(parseInt(currentFrame), curr_img_data)
}
