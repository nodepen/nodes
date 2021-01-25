import { useContext } from 'react'
import { SceneContext } from './types'
import { context } from './state'

export const useSceneManager = (): SceneContext => {
  return useContext(context)
}
