import { Option } from './Option'
import { NoneError } from './NoneError'

class Match<T> {
  private some: T;
  private none: NoneError

  constructor(option: Option<T>) {
    if ('some' in option) {
      this.some = option.some
    } else {
      this.none = option.none
    }
  }

  public then = (callback: (some?: T, none?: NoneError) => any): void => {
    callback(this.some, this.none)
  }
}

export const get = <T>(option: Option<T>): Match<T> => {
  return new Match<T>(option)
}