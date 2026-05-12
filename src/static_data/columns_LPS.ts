import {posture} from './posture'
import {status} from './status'

const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "global_id",
    header: "Glo",
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: { editor: "select", options: status },
  },
  {
    accessorKey: "is_hidden",
    header: "Hid",
  },
  {
    accessorKey: "Behavior",
    header: "Pos",
    meta: { editor: "select", options: posture },
  },
]

export {columns}
