import { useAppSelector } from '$'
import { cameraSelectors } from '../cameraSlice'
import { CameraState } from '../types'

export const useCameraZoom = (): CameraState['zoom'] => {
  return useAppSelector(cameraSelectors.selectZoom)
}
