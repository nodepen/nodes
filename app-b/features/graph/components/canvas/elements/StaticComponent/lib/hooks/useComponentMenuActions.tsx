import { useCallback, useMemo } from 'react'
import { NodePen } from 'glib'
import { MenuAction } from 'features/graph/types'

export const useComponentMenuActions = (element: NodePen.Element<'static-component'>): MenuAction<typeof element>[] => {
  const handleAction = useCallback((context: typeof element): void => {
    console.log('Action!')
  }, [])

  const actions: MenuAction<typeof element>[] = useMemo(
    () => [
      {
        position: 0,
        label: <p>About</p>,
        icon: <p></p>,
        onClick: handleAction,
      },
      {
        position: 60,
        label: <p>View data</p>,
        icon: <p></p>,
        onClick: handleAction,
      },
      {
        position: 120,
        label: <p>Cut</p>,
        icon: <p></p>,
        onClick: handleAction,
      },
      {
        position: 180,
        label: <p>Copy</p>,
        icon: <p></p>,
        onClick: handleAction,
      },
      {
        position: 240,
        label: <p>Delete</p>,
        icon: <p></p>,
        onClick: handleAction,
      },
      {
        position: 300,
        label: <p>View model</p>,
        icon: <p></p>,
        onClick: handleAction,
      },
    ],
    [element, handleAction]
  )

  return actions
}
