import { useAppSelector } from '$'
import { hotkeySelectors } from '../hotkeySlice'

export const useCopyPasteHotkey = (): ReturnType<typeof hotkeySelectors['selectCopyPasteHotkey']> => {
  return useAppSelector(hotkeySelectors.selectCopyPasteHotkey)
}
