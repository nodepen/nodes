import { useAppSelector } from '$'
import { sceneSelectors } from '../sceneSlice'
import { DisplayMode } from '../types'

export const useDisplayMode = (): DisplayMode => {
  return useAppSelector(sceneSelectors.selectDisplayMode)
}
