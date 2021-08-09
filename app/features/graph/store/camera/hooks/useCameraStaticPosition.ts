import { useAppSelector } from '$'
import { cameraSelectors } from '../cameraSlice'

export const useCameraStaticPosition = (): [number, number] => {
  return useAppSelector(cameraSelectors.selectStaticPosition)
}
