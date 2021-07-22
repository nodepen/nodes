import { useAppSelector } from '$'
import { hotkeySelectors } from '../hotkeySlice'

export const useWireMode = (): 'default' | 'add' | 'remove' => {
  return useAppSelector(hotkeySelectors.selectWireMode)
}
