import { ComponentParameter } from './ComponentParameter'

export interface Component {
  category: string
  description: string
  guid: string
  icon: string
  inputs: ComponentParameter[]
  isObsolete: boolean
  isVariable: boolean
  libraryName: string
  name: string
  nickname: string
  outputs: ComponentParameter[]
  subcategory: string
}
