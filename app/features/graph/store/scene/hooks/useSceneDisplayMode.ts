import { useAppSelector } from '$'
import { sceneSelectors } from '../sceneSlice'
import { DisplayMode } from '../types'

export const useSceneDisplayMode = (): DisplayMode => {
  return useAppSelector(sceneSelectors.selectDisplayMode)
}
