import { Grasshopper } from 'glib'
import { Socket } from 'socket.io-client'

export type GraphAction =
  | { type: 'demo' }
  | { type: 'session/register-socket', socket: Socket, id: string }
  | { type: 'session/load-components', components: Grasshopper.Component[] }
  | { type: 'session/restore-session', elements: string }
  | { type: 'session/set-ready' }
  | { type: 'graph/register-camera', ref: React.MutableRefObject<HTMLDivElement> }
  | { type: 'graph/register-element', ref: React.MutableRefObject<HTMLDivElement>, id: string }
  | { type: 'graph/add-component', position: [number, number], component: Grasshopper.Component }
  | { type: 'graph/add-parameter', position: [number, number], component: Grasshopper.Component }
  | { type: 'graph/clear' }
  | { type: 'camera/reset' }
  | { type: 'camera/pan', dx: number, dy: number }