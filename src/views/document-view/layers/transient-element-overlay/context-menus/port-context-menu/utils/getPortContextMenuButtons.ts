import type { PortContextMenuContext } from '../../../types'

type PortContextMenuButtons = {
  enablePin: boolean
  enableSetValue: boolean
}

export const getPortContextMenuButtons = (context: PortContextMenuContext): PortContextMenuButtons => {
  const { portTemplate } = context
  const { __direction: direction, typeName } = portTemplate

  const supportedTypeNames = [
    'number',
    'integer',
    'boolean',
    'text',
    'string'
  ]

  const enablePin = direction === 'input'
  const enableSetValue = direction === 'input' && supportedTypeNames.includes(typeName)

  return { enablePin, enableSetValue }
}
