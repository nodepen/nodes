import { useAppSelector } from '$'
import { hotkeySelectors } from '../hotkeySlice'

export const useVisibilityHotkey = (): ReturnType<typeof hotkeySelectors['selectVisibilityHotkey']> => {
  return useAppSelector(hotkeySelectors.selectVisibilityHotkey)
}
