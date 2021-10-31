import { configureStore } from '@reduxjs/toolkit'
import { cameraReducer, cameraActions } from 'features/graph/store/camera'
import { graphReducer, graphActions } from 'features/graph/store/graph'
import { hotkeyReducer, hotkeyActions } from 'features/graph/store/hotkey'
import { sceneReducer, sceneActions } from 'features/graph/store/scene'
import { solutionReducer, solutionActions } from 'features/graph/store/solution'
import undoable, { excludeAction } from 'redux-undo'

export const store = configureStore({
  reducer: {
    camera: cameraReducer,
    graph: undoable(graphReducer, {
      filter: excludeAction([
        graphActions.addLiveElement.type,
        graphActions.batchUpdateLiveElement.type,
        graphActions.updateLiveElement.type,
        graphActions.deleteLiveElements.type,
        graphActions.updateSelection.type,
        graphActions.setProvisionalWire.type,
        graphActions.clearProvisionalWire.type,
        graphActions.prepareLiveMotion.type,
        graphActions.dispatchLiveMotion.type,
        graphActions.setMode.type,
        graphActions.startLiveWires.type,
        graphActions.updateLiveWires.type,
        graphActions.captureLiveWires.type,
        graphActions.releaseLiveWires.type,
        ...Object.values(cameraActions).map((action) => action.type),
        ...Object.values(hotkeyActions).map((action) => action.type),
        ...Object.values(sceneActions).map((action) => action.type),
        ...Object.values(solutionActions).map((action) => action.type),
      ]),
      groupBy: (action, current, _previous) => {
        const ELEMENT_PLACEMENT = [
          graphActions.addElement.type,
          graphActions.registerElement.type,
          graphActions.registerElementAnchor.type,
        ]

        const id = current.registry.latest.element

        if (ELEMENT_PLACEMENT.includes(action.type)) {
          return `ELEMENT_PLACEMENT_${id}`
        }

        return null
      },
      limit: 10,
    }),
    hotkey: hotkeyReducer,
    scene: sceneReducer,
    solution: solutionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type RootDispatch = typeof store.dispatch
