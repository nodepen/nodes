import { useContext } from 'react'
import { context } from './state'

export const useGraphManager = () => {
  return useContext(context)
}