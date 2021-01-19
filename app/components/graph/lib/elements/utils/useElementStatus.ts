import { useMemo } from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { getElementStatus } from './getElementStatus'

/**
 * Necessary to handle changes over a solution lifecycle.
 * @remarks If we just did `'warn' === yellow`, then `waiting` would flash colors.
 * @param id Id of element to watch
 * @returns [status, color]
 */
export const useElementStatus = (id: string): [string, string] => {
  const {
    store: { elements, solution, selected },
  } = useGraphManager()

  const element = elements[id] as Glasshopper.Element.StaticComponent | Glasshopper.Element.StaticParameter
  const status = getElementStatus(element, solution.id)

  const color: string = useMemo(() => {
    if (selected.includes(id)) {
      return '#98E2C6'
    }

    if (status === 'waiting') {
      switch (element.current.runtimeMessage?.level ?? 'none') {
        case 'warning': {
          return '#FFBE71'
        }
        case 'error': {
          return '#FF7171'
        }
        default: {
          return '#FFFFFF'
        }
      }
    }

    switch (status) {
      case 'idle': {
        return '#FFFFFF'
      }
      case 'warning': {
        return '#FFBE71'
      }
      case 'error': {
        return '#FF7171'
      }
      default: {
        return '#FFFFFF'
      }
    }
  }, [element, id, selected, status])

  return [status, color]
}
