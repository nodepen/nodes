import { Grasshopper } from 'glib'
import { useMemo } from 'react'

export const useSelectedComponent = (
  candidates: Grasshopper.Component[],
  selection: number,
  shortcutTemplate?: Grasshopper.Component,
  hoverTemplate?: Grasshopper.Component
): Grasshopper.Component | undefined => {
  return useMemo(() => {
    return hoverTemplate ?? shortcutTemplate ?? candidates[selection]
  }, [candidates, selection, shortcutTemplate, hoverTemplate])
}
