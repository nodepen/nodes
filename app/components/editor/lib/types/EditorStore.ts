import { Grasshopper } from '@/../lib'

export type EditorStore = {
  graph: {
    components: any[]
    wires: any[]
  }
  selection: {
    components: string[]
  }
  library: {
    components: Grasshopper.Component[]
  }
  camera: {
    position: [number, number]
  }
}
