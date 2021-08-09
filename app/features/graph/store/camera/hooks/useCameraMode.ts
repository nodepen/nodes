import { useAppSelector } from '$'
import { cameraSelectors } from '../cameraSlice'
import { CameraMode } from '../types'

export const useCameraMode = (): CameraMode => {
  return useAppSelector(cameraSelectors.selectCameraMode)
}
