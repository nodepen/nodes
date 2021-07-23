import { configureStore } from '@reduxjs/toolkit'
import { cameraReducer } from 'features/graph/store/camera'
import { graphReducer, graphActions } from 'features/graph/store/graph'
import { hotkeyReducer } from 'features/graph/store/hotkey'
import { overlayReducer } from 'features/graph/store/overlay'
import undoable, { excludeAction } from 'redux-undo'

export const store = configureStore({
  reducer: {
    camera: cameraReducer,
    graph: undoable(graphReducer, {
      // TODO: Add an 'internal move' so we can't undo the recenter move-on-place
      filter: excludeAction([
        graphActions.updateLiveElement.type,
        graphActions.startLiveWire.type,
        graphActions.updateLiveWire.type,
        graphActions.captureLiveWire.type,
        graphActions.releaseLiveWire.type,
        graphActions.endLiveWire.type,
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
      ]),
    }),
    hotkey: hotkeyReducer,
    overlay: overlayReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type RootDispatch = typeof store.dispatch
