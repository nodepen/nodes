export type EditorStore = {
  graph: {
    components: any[]
    wires: any[]
  }
  selection: {
    components: string[]
  }
  camera: {
    position: [number, number]
  }
}
