import { useAppSelector } from '$'
import { cameraSelectors } from '../cameraSlice'
import { CameraState } from '../types'

export const useCameraRegistry = (): CameraState['registry'] => {
  return useAppSelector(cameraSelectors.selectRegistry)
}
