import { GrasshopperParameterType } from './GrasshopperParameterType'

export type GrasshopperParameter = {
    name: string
    nickname: string
    description: string
    type: GrasshopperParameterType
    isOptional: boolean
  }
