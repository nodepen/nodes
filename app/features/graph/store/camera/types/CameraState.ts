import { CameraMode } from './CameraMode'

export type CameraState = {
  mode: CameraMode
  zoom: {
    live: number
    static: number
  }
  position: {
    live: [number, number]
    static: [number, number]
  }
  lock: {
    pan: boolean
    zoom: boolean
  }
}
