import { CameraMode } from './CameraMode'

export type CameraState = {
  mode: CameraMode
  zoom: {
    live: number
    static: number
  }
  position: [number, number]
  lock: {
    pan: boolean
    zoom: boolean
  }
  registry: {
    moveTo?: (x: number, y: number) => void
  }
}
