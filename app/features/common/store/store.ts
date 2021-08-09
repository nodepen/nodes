import { configureStore } from '@reduxjs/toolkit'
import { cameraReducer, cameraActions } from 'features/graph/store/camera'
import { graphReducer, graphActions } from 'features/graph/store/graph'
import { hotkeyReducer, hotkeyActions } from 'features/graph/store/hotkey'
import undoable, { excludeAction } from 'redux-undo'

export const store = configureStore({
  reducer: {
    camera: cameraReducer,
    graph: undoable(graphReducer, {
      // TODO: Add an 'internal move' so we can't undo the recenter move-on-place
      filter: excludeAction([
        graphActions.moveLiveElement.type,
        graphActions.updateLiveElement.type,
        graphActions.updateSelection.type,
        graphActions.setProvisionalWire.type,
        graphActions.clearProvisionalWire.type,
        graphActions.prepareLiveMotion.type,
        graphActions.dispatchLiveMotion.type,
        graphActions.setMode.type,
        graphActions.registerElement.type,
        graphActions.registerElementAnchor.type,
        graphActions.startLiveWires.type,
        graphActions.updateLiveWires.type,
        graphActions.captureLiveWires.type,
        graphActions.releaseLiveWires.type,
        ...Object.values(cameraActions).map((action) => action.type),
        ...Object.values(hotkeyActions).map((action) => action.type),
      ]),
      limit: 10,
    }),
    hotkey: hotkeyReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type RootDispatch = typeof store.dispatch
