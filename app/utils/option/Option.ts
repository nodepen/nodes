import { NoneError } from './NoneError'

export type Option<T> = { some: T } | { none: NoneError }
