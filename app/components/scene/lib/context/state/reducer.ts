import { SceneStore, SceneAction } from '../types'

export const reducer = (store: SceneStore, action: SceneAction): SceneStore => {
  switch (action.type) {
    case 'selection/set': {
      const { selection } = action

      store.selection = selection

      return { ...store }
    }
  }
}
