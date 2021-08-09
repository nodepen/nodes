import { useMemo } from 'react'
import { Grasshopper } from 'glib'
import { shortcuts } from '../data'
import { ComponentShortcut } from '../types'
import { mapToIds } from '../utils'

/**
 * Given a text query and a collection of known shortcuts, return shortcut information if there is a match.
 */
export const useLibraryShortcuts = (
  query: string,
  library: Grasshopper.Component[] = []
): [shortcut: ComponentShortcut | undefined, shortcutTemplate: Grasshopper.Component | undefined] => {
  const libraryByIds = useMemo(() => mapToIds(library ?? []), [library])

  const shortcut = shortcuts.find((sc) => sc.test(query))

  const template = shortcut ? libraryByIds[shortcut.template] : undefined

  return [shortcut, template]
}
