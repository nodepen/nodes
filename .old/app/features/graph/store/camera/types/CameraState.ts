import { CameraMode } from './CameraMode'
import { CameraZoomLevel } from './CameraZoomLevel'

export type CameraState = {
  mode: CameraMode
  zoom: {
    live: number
    static: number
    level: CameraZoomLevel
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
