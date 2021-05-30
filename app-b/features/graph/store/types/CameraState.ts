import { CameraMode } from './CameraMode'
import { SetTransform } from '../../types'

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
    setTransform?: SetTransform
  }
}
