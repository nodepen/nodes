import { useAppSelector } from '$'
import { cameraSelectors } from '../cameraSlice'

export const useCameraZoomLock = (): boolean => {
  return useAppSelector(cameraSelectors.selectCameraZoomLock)
}
