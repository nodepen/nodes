import { useAppSelector } from '$'
import { hotkeySelectors } from '../hotkeySlice'

export const useWireMode = (): 'default' | 'add' | 'remove' | 'transpose' => {
  return useAppSelector(hotkeySelectors.selectWireMode)
}
