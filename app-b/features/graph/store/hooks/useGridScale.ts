import { useAppSelector } from '$'
import { cameraSelectors } from '../cameraSlice'

export const useGridScale = (): number => {
  const zoom = useAppSelector(cameraSelectors.selectZoom)
  return zoom < 0.5 ? 5 : 1
}
