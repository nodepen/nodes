import { useEffect, useState } from 'react'
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

  const [color, setColor] = useState('#FFFFFF')

  useEffect(() => {
    if (selected.includes(id)) {
      setColor('#98E2C6')
      return
    }

    switch (status) {
      case 'idle': {
        setColor('#FFFFFF')
        break
      }
      case 'warning': {
        setColor('#FFBE71')
        break
      }
      case 'error': {
        setColor('#FF7171')
        break
      }
    }
  }, [element, id, selected, status])

  return [status, color]
}
