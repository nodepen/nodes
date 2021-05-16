import { useAppSelector } from '$'
import { cameraSelectors } from '../cameraSlice'
import { CameraState } from '../types'

export const useCamera = (): CameraState => {
  const camera: CameraState = {
    zoom: useAppSelector(cameraSelectors.selectZoom),
    position: useAppSelector(cameraSelectors.selectPosition),
  }

  return camera
}
