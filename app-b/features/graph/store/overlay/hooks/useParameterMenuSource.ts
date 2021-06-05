import { useAppSelector } from '$'
import { overlaySelectors } from '../overlaySlice'
import { OverlayState } from '../types'

export const useParameterMenuSource = (): OverlayState['parameterMenu']['source'] => {
  return useAppSelector(overlaySelectors.selectParameterMenuSource)
}
