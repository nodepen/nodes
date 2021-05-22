import { GrasshopperParameter } from './GrasshopperParameter'

export type GrasshopperComponent = {
    category: string
    description: string
    guid: string
    icon: string
    inputs: GrasshopperParameter[]
    isObsolete: boolean
    isVariable: boolean
    libraryName: string
    name: string
    nickname: string
    outputs: GrasshopperParameter[]
    subcategory: string
  }