import { useAppDispatch } from '$'
import { overlayActions } from '../overlaySlice'
import { OverlayState, Payload } from '../types'

export const useOverlayDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    show: (data: Payload.ShowPayload) => dispatch(overlayActions.show(data)),
    clear: () => dispatch(overlayActions.clear()),
    setParameterMenuConnection: (data: OverlayState['parameterMenu']['connection']) =>
      dispatch(overlayActions.setParameterMenuConnection(data)),
  }
}
