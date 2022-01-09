import { BaseResolverContext } from './BaseResolverContext'

export type BaseResolverMap<T, U extends { [key: string]: any }> = {
  [Field in keyof U]: (
    parent: T,
    args: U[Field],
    context: BaseResolverContext,
    x: unknown
  ) => unknown
}
