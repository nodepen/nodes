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
  | { type: 'graph/register-element-anchor', elementId: string, anchorKey: string, position: [number, number] }
  | { type: 'graph/add-component', position: [number, number], component: Grasshopper.Component }
  | { type: 'graph/add-parameter', position: [number, number], component: Grasshopper.Component }
  | { type: 'graph/selection-region', from: [number, number], to: [number, number], partial: boolean }
  | { type: 'graph/selection-add', id: string }
  | { type: 'graph/selection-remove', id: string }
  | { type: 'graph/selection-toggle', id: string }
  | { type: 'graph/selection-clear' }
  | { type: 'graph/wire/start-live-wire', from: [number, number], to: [number, number], owner: { element: string, parameter: string } }
  | { type: 'graph/wire/update-live-wire', to: [number, number] }
  | { type: 'graph/wire/stop-live-wire' }
  | { type: 'graph/wire/capture-live-wire', targetElement: string, targetParameter: string }
  | { type: 'graph/wire/release-live-wire', targetElement: string, targetParameter: string }
  | { type: 'graph/values/set-one-value', targetElement: string, targetParameter: string, value: string }
  | { type: 'graph/clear' }
  | { type: 'camera/reset' }
  | { type: 'camera/pan', dx: number, dy: number }