import { useAppSelector } from '$'
import { hotkeySelectors } from '../hotkeySlice'

export const useHistoryHotkey = (): ReturnType<typeof hotkeySelectors['selectHistoryHotkey']> => {
  return useAppSelector(hotkeySelectors.selectHistoryHotkey)
}
