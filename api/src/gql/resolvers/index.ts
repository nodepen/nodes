import { Mutation } from './mutation'
import { Query } from './query'
import { Subscription } from './subscription'

export const resolvers = {
  Mutation,
  Query,
  Subscription,
  Solution: {
    value: (parent: any, args: any, context: any) => {
      console.log({ parent })
      console.log({ args })
      console.log({ context })

      return { type: 'some-type', value: 'some-value' }
    },
  },
}
