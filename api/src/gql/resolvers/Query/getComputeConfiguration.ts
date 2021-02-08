import { Grasshopper } from 'glib'
import { serverConfig } from '../../../store'

export const getComputeConfiguration = (): Grasshopper.Component[] => {
  return serverConfig
}
