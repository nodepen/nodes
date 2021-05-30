import { SetTransform } from '@/features/graph/types'
import { Grasshopper } from 'glib'

export type GraphStore = {
  library?: Grasshopper.Component[]
  registry: {
    setTransform?: SetTransform
  }
  register: {
    setTransform: (setTransform: SetTransform) => void
  }
}
