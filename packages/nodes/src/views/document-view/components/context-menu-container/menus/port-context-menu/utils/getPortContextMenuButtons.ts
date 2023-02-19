import type { PortContextMenuContext } from '../../../types'

type PortContextMenuButtons = {
    enablePin: boolean
    enableSetValue: boolean
}

export const getPortContextMenuButtons = (context: PortContextMenuContext): PortContextMenuButtons => {
    const { portTemplate } = context
    const { __direction: direction, typeName } = portTemplate

    const enablePin = direction === 'input'
    const enableSetValue = direction === 'input' && (typeName === 'number' || typeName === 'integer')

    return { enablePin, enableSetValue }
}