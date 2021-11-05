import { useAppSelector } from '$'
import { hotkeySelectors } from '../hotkeySlice'

export const useSpaceBar = (): ReturnType<typeof hotkeySelectors['selectSpace']> => {
  return useAppSelector(hotkeySelectors.selectSpace)
}
