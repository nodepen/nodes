import { useAppSelector } from '$'
import { cameraSelectors } from '../cameraSlice'
import { CameraState } from '../types'

export const useCameraPosition = (): CameraState['position'] => {
  return useAppSelector(cameraSelectors.selectPosition)
}
