import { useAppSelector } from '$'
import { cameraSelectors } from '../cameraSlice'

export const useCameraLiveZoom = (): number => {
  return useAppSelector(cameraSelectors.selectLiveZoom)
}
