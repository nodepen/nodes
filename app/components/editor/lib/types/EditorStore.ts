import { Grasshopper, Glasshopper } from '@/../lib'

export type EditorStore = {
  graph: {
    components: Glasshopper.Component[]
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
