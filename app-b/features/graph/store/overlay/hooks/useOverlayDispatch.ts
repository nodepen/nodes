import { useAppDispatch } from '$'
import { overlayActions } from '../overlaySlice'
import { Payload } from '../types'

export const useOverlayDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    show: (data: Payload.ShowPayload) => dispatch(overlayActions.show(data)),
    clear: () => dispatch(overlayActions.clear()),
    setParameterMenuConnection: (data: Payload.ConnectionPayload) =>
      dispatch(overlayActions.setParameterMenuConnection(data)),
    clearParameterMenuConnection: () => dispatch(overlayActions.clearParameterMenuConnection()),
  }
}
