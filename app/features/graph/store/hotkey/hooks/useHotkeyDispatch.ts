import { useAppDispatch } from '$'
import { hotkeyActions } from '../hotkeySlice'
import { Payload } from '../types'

export const useHotkeyDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    setKey: (data: Payload.SetKeyPayload) => dispatch(hotkeyActions.setKey(data)),
    clearKeys: () => dispatch(hotkeyActions.clearKeys()),
  }
}
