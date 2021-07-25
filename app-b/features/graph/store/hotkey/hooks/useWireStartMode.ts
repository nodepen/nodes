import { useAppSelector } from '$'
import { hotkeySelectors } from '../hotkeySlice'

export const useWireStartMode = (): 'default' | 'add' | 'remove' | 'transpose' => {
  return useAppSelector(hotkeySelectors.selectWireStartMode)
}
