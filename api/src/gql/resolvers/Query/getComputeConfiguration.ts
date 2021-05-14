import { Grasshopper } from 'glib'
import { serverConfig } from '../../../store'

export const getComputeConfiguration = (): Grasshopper.Component[] => {
  console.log('Delivering server config.')
  return serverConfig
}
