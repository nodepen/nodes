import { NodePen } from 'glib'

export type LiveWireElement = NodePen.Element<'wire'> & { template: { type: 'wire'; mode: 'live' } }
