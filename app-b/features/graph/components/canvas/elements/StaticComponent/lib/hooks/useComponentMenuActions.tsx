import { useCallback, useMemo } from 'react'
import { NodePen } from 'glib'
import { MenuAction } from 'features/graph/types'
import { AboutMenu } from '../menus'

export const useComponentMenuActions = (element: NodePen.Element<'static-component'>): MenuAction<typeof element>[] => {
  const handleAction = useCallback((context: typeof element): void => {
    console.log('Action!')
  }, [])

  const actions: MenuAction<typeof element>[] = useMemo(
    () => [
      {
        position: 0,
        label: <p>About</p>,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        menu: <AboutMenu component={element.template} />,
        onClick: handleAction,
      },
      {
        position: 60,
        label: <p>View data</p>,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        ),
        menu: <p>content</p>,
        onClick: handleAction,
      },
      {
        position: 120,
        label: <p>Select</p>,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
        ),
        menu: <p>content</p>,
        onClick: handleAction,
      },
      {
        position: 180,
        label: <p>Copy</p>,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        ),
        menu: <p>content</p>,
        onClick: handleAction,
      },
      {
        position: 240,
        label: <p>Delete</p>,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        ),
        menu: <p>content</p>,
        onClick: handleAction,
      },
      {
        position: 300,
        label: <p>View in model</p>,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        ),
        menu: <p>content</p>,
        onClick: handleAction,
      },
    ],
    [element, handleAction]
  )

  return actions
}
