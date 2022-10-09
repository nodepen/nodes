import type { PortTemplate } from './PortTemplate'

export type NodeTemplate = {
  guid: string
  name: string
  nickname: string
  description: string
  keywords: string[]
  icon?: string
  libraryName: string
  category: string
  subcategory: string
  isObsolete: boolean
  inputs: PortTemplate[]
  outputs: PortTemplate[]
}