import { WireMode } from '../../graph/types'
import { HotkeyState } from '../types'

/**
 * Same as `getWireMode`, but allow 'transpose'
 * @param state
 * @returns
 */
export const getInitialWireMode = (state: HotkeyState): WireMode | 'transpose' => {
  const { shift, control } = state

  return shift && control ? 'transpose' : shift ? 'add' : control ? 'remove' : 'default'
}
