import { useContext } from 'react'
import { context } from './state'
import { GraphAction, GraphStore } from './types'

export const useGraphManager = () => {
  const { store, dispatch } = useContext(context)

  return store
}