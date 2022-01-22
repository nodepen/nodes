import { useAppDispatch } from '$'
import { sceneActions } from '../sceneSlice'
import { DisplayMode } from '../types'

export const useSceneDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    setDisplayMode: (mode: DisplayMode) => dispatch(sceneActions.setDisplayMode(mode)),
  }
}
