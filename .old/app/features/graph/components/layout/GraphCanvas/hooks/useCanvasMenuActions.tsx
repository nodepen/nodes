import { MenuAction } from 'features/graph/types'
import { useGraphDispatch, useGraphSelection } from 'features/graph/store/graph/hooks'
import { useSetCameraPosition } from 'features/graph/hooks'
import { useSolutionDispatch } from '@/features/graph/store/solution/hooks'
import { useSceneDispatch } from '@/features/graph/store/scene/hooks'

export const useCanvasMenuActions = (onAddComponent: () => void): MenuAction<never>[] => {
  const { undo, redo, reset, setVisibility, deleteElements } = useGraphDispatch()
  const selection = useGraphSelection()
  const { expireSolution } = useSolutionDispatch()
  const { setDisplayMode } = useSceneDispatch()
  const setCameraPosition = useSetCameraPosition()

  const RedoAction: MenuAction<never> = {
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
  }

  const UndoAction: MenuAction<never> = {
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
  }

  const ResetCameraAction: MenuAction<never> = {
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
    label: <p>Reset</p>,
    menu: <p></p>,
    onClick: (): void => {
      setCameraPosition(0, 0, 'TL', 0, 300, 1)
    },
  }

  const ClearGraphAction: MenuAction<never> = {
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
    label: <p>Clear</p>,
    menu: <p></p>,
    onClick: reset,
  }

  const AddComponentAction: MenuAction<never> = {
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
  }

  const ViewModelAction: MenuAction<never> = {
    position: 320,
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
    label: <p>View Model</p>,
    menu: <></>,
    onClick: () => setDisplayMode('show'),
  }

  const RecomputeAction: MenuAction<never> = {
    position: 0,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: <p>Recompute</p>,
    menu: <p></p>,
    onClick: expireSolution,
  }

  const defaultActions = [
    RedoAction,
    UndoAction,
    ResetCameraAction,
    ClearGraphAction,
    AddComponentAction,
    ViewModelAction,
    RecomputeAction,
  ]

  const DeleteSelectionAction: MenuAction<never> = {
    position: 220,
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
    label: <p>Delete</p>,
    menu: <p></p>,
    onClick: () => deleteElements(selection),
  }

  const ShowSelectionAction: MenuAction<never> = {
    position: 180,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
    label: <p>Show</p>,
    menu: <p></p>,
    onClick: () => setVisibility(selection, 'visible'),
  }

  const HideSelectionAction: MenuAction<never> = {
    position: 140,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      </svg>
    ),
    label: <p>Hide</p>,
    menu: <p></p>,
    onClick: () => setVisibility(selection, 'hidden'),
  }

  const selectionActions = [
    DeleteSelectionAction,
    ShowSelectionAction,
    HideSelectionAction,
    AddComponentAction,
    ViewModelAction,
    RecomputeAction,
  ]

  // const actions = useMemo(() => selection ? selectionActions : defaultActions, [selection])

  return selection.length > 0 ? selectionActions : defaultActions
}
