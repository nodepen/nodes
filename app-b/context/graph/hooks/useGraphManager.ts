import { useContext } from 'react'
import { GraphContext } from '../GraphManager'
import { GraphStore } from '../types'

export const useGraphManager = (): GraphStore => {
  return useContext(GraphContext)
}
