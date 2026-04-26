import React from "react"; 
import {behaviors} from './behaviors'
import {posture} from './posture'
import {confidence} from './confidence'
import { Button } from '@/components/ui/button'

const columns = (remove_table_index) => [
  {
    accessorKey: "id",
    header: "ID",
    enableEditing: false,
    meta: { width: "40px" },
  },
  {
    accessorKey: "global_id",
    header: "Glo",
    meta: { width: "70px" },
  },
  {
    accessorKey: "posture",
    header: "Posture",
    meta: { editor: "select", options: posture },
  },
  {
    accessorKey: "behavior",
    header: "Behavior",
    meta: { editor: "select", options: behaviors },
  },
  {
    accessorKey: "confidence",
    header: "Confidence",
    meta: { editor: "select", options: confidence },
  },
  {
    id: "remove",
    header: () => (
      <div>
        Del
        <Button
          variant="destructive"
          size="xs"
          onClick={() => remove_table_index()}
        >
          Del
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <Button
        variant="destructive"
        size="xs"
        onClick={() => remove_table_index(row.original.id)}
      >
        Del
      </Button>
    ),
    enableEditing: false,
    meta: { width: "50px" },
  },
]

export {columns}
