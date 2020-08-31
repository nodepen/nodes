import { GrasshopperComponentParameter } from './GrasshopperComponentParameter'

export interface GrasshopperComponent {
    Category: string
    Description: string
    Guid: string
    Icon: string
    Inputs: GrasshopperComponentParameter[]
    IsObsolete: boolean
    IsVariable: boolean
    LibraryName: string
    Name: string
    NickName: string
    Outputs: GrasshopperComponentParameter[]
    Subcategory: string
}