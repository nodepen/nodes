import { useAppSelector } from '$'
import { cameraSelectors } from '../cameraSlice'
import { CameraZoomLevel } from '../types'

export const useCameraZoomLevel = (): CameraZoomLevel => {
  return useAppSelector(cameraSelectors.selectZoomLevel)
}
