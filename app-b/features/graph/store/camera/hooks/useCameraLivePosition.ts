import { useAppSelector } from '$'
import { cameraSelectors } from '../cameraSlice'

export const useCameraLivePosition = (): [number, number] => {
  return useAppSelector(cameraSelectors.selectLivePosition)
}
