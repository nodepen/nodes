import { useAppSelector } from '$'
import { overlaySelectors } from '../overlaySlice'
import { OverlayState } from '../types'

export const useParameterMeneConnection = (): OverlayState['parameterMenu']['connection'] => {
  return useAppSelector(overlaySelectors.selectParameterMenuConnection)
}
