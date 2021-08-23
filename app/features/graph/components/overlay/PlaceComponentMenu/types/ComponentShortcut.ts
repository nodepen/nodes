import { NodePen } from 'glib'

export type ComponentShortcut = {
  test: (value: string) => boolean
  pattern: string
  label?: string
  description: string
  template: string
  onCreate: (value: string) => Partial<NodePen.Element<'number-slider'>['current']>
}
