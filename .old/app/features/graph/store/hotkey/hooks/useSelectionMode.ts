import { useAppSelector } from '$'
import { hotkeySelectors } from '../hotkeySlice'

export const useSelectionMode = (): ReturnType<typeof hotkeySelectors['selectSelectionMode']> => {
  return useAppSelector(hotkeySelectors.selectSelectionMode)
}
