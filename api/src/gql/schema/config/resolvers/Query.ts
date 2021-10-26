import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'
import { allowed } from '../../../../data/allowed'

export const Query: BaseResolverMap<never, Arguments['Query']> = {
  getInstalledComponents: async () => {
    return allowed
  },
}
