import { useAppSelector } from '$'
import { overlaySelectors } from '../overlaySlice'
import { OverlayState } from '../types'

export const useOverlayVisibility = (): OverlayState['show'] => {
  return useAppSelector(overlaySelectors.selectOverlayVisibility)
}
