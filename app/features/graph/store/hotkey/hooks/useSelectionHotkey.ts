import { useAppSelector } from '$'
import { hotkeySelectors } from '../hotkeySlice'

export const useSelectionHotkey = (): ReturnType<typeof hotkeySelectors['selectSelectionHotkey']> => {
  return useAppSelector(hotkeySelectors.selectSelectionHotkey)
}
