import { WireMode } from '../../graph/types'
import { HotkeyState } from '../types'

export const getWireMode = (state: HotkeyState): WireMode => {
  const { shift, control } = state

  return shift && control ? 'default' : shift ? 'add' : control ? 'remove' : 'default'
}
