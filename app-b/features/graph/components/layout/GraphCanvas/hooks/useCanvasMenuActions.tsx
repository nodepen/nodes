import { useMemo } from 'react'
import { MenuAction } from 'features/graph/types'
import { useGraphDispatch } from 'features/graph/store/graph/hooks'

export const useCanvasMenuActions = (onAddComponent: () => void): MenuAction<never>[] => {
  const { undo, redo, reset } = useGraphDispatch()

  const actions: MenuAction<never>[] = useMemo(() => {
    return [
      {
        position: 120,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
            />
          </svg>
        ),
        label: <p>Redo</p>,
        menu: <p></p>,
        onClick: redo,
      },
      {
        position: 160,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
            />
          </svg>
        ),
        label: <p>Undo</p>,
        menu: <p></p>,
        onClick: undo,
      },
      {
        position: 200,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        ),
        label: <p>Center</p>,
        menu: <p></p>,
        onClick: (): void => {
          // ok
        },
      },
      {
        position: 240,
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
        label: <p>Reset</p>,
        menu: <p></p>,
        onClick: reset,
      },
      {
        position: 40,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        label: <p>Add Component</p>,
        menu: <></>,
        onClick: onAddComponent,
      },
      {
        position: 320,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        ),
        label: <p>Refresh</p>,
        menu: <p></p>,
        onClick: (): void => {
          //ok
        },
      },
    ]
  }, [])

  return actions
}
