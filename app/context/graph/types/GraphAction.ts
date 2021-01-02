import { Grasshopper } from 'glib'
import { Socket } from 'socket.io-client'

export type GraphAction =
  | { type: 'demo' }
  | { type: 'io/register-socket', socket: Socket, id: string }
  | { type: 'lib/load-components', components: Grasshopper.Component[] }