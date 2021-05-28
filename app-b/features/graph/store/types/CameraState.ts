export type CameraState = {
  mode: 'idle' | 'zooming'
  zoom: {
    live: number
    static: number
  }
  position: [number, number]
}
