import { NodePen } from 'glib'

export type ComponentShortcut = {
  test: (value: string) => boolean
  pattern: string
  description: JSX.Element
  template: string
  onCreate: (value: string) => NodePen.Element<NodePen.ElementType>
}
