import { Grasshopper } from 'glib'
import { useMemo } from 'react'

export const useSelectedComponent = (
  candidates: Grasshopper.Component[],
  selection: number,
  shortcut?: Grasshopper.Component
): Grasshopper.Component | undefined => {
  return useMemo(() => {
    return shortcut ?? candidates[selection]
  }, [candidates, selection, shortcut])
}
