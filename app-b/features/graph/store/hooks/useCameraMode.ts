import { useAppSelector } from '$'
import { cameraSelectors } from '../cameraSlice'

export const useCameraMode = (): 'idle' | 'zooming' => {
  return useAppSelector(cameraSelectors.selectCameraMode)
}
