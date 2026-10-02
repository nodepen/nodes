export type PortTemplate = {
  __order: number
  __direction: PortDirection
  name: string
  nickName: string
  description: string
  typeName: string
  keywords: string[]
  isOptional: boolean
}

export type PortDirection = 'input' | 'output'
