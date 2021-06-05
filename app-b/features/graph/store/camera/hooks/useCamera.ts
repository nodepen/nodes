import { useAppSelector } from '$'
import { cameraSelectors } from '../cameraSlice'
import { CameraState } from '../types'

export const useCamera = (): CameraState => {
  return useAppSelector(cameraSelectors.selectCamera)
}
