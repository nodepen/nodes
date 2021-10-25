import { Grasshopper } from 'glib'
import { ResolverFn } from 'graphql-subscriptions'
import {} from 'apollo-server-core'
import { RequestContext } from '../../../types'

export const value = async (
  args: unknown,
  context: unknown,
  info: RequestContext
): Promise<{ type: string; value: string }> => {
  console.log('value')
  console.log({ parent })
  console.log({ args })
  console.log({ context })

  return { type: 'ok', value: 'ok!' }
}
