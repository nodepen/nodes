import React from 'react'
import { GraphAction } from './GraphAction'
import { GraphStore } from './GraphStore'

export type GraphContext = {
  store: GraphStore
  dispatch: React.Dispatch<GraphAction>
}
