import { useContext } from 'react'
import { GenericMenuContext } from '../context/GenericMenuManager'
import { GenericMenuStore } from '../types'

export const useGenericMenuManager = (): GenericMenuStore => {
  return useContext(GenericMenuContext)
}
