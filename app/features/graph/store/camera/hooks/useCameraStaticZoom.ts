import { useAppSelector } from '$'
import { cameraSelectors } from '../cameraSlice'

export const useCameraStaticZoom = (): number => {
  return useAppSelector(cameraSelectors.selectStaticZoom)
}
