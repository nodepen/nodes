import { ComponentParameter } from './ComponentParameter'

export interface Component {
  Category: string
  Description: string
  Guid: string
  Icon: string
  Inputs: ComponentParameter[]
  IsObsolete: boolean
  IsVariable: boolean
  LibraryName: string
  Name: string
  NickName: string
  Outputs: ComponentParameter[]
  Subcategory: string
}
