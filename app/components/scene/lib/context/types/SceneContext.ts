import React from 'react'
import { SceneStore } from './SceneStore'
import { SceneAction } from './SceneAction'

export type SceneContext = {
  store: SceneStore
  dispatch: React.Dispatch<SceneAction>
}
