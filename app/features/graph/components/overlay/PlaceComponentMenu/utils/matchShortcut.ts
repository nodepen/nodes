import { ComponentShortcut } from '../types'
import { shortcuts } from '../data'

export const matchShortcut = (value: string): ComponentShortcut | undefined => {
  return shortcuts.find((shortcut) => shortcut.test(value))
}
