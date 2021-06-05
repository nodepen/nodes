import { useAppSelector } from '$'
import { overlaySelectors } from '../overlaySlice'
import { OverlayState } from '../types'

export const useParameterMenu = (): OverlayState['parameterMenu'] => {
  return useAppSelector(overlaySelectors.selectParameterMenu)
}
