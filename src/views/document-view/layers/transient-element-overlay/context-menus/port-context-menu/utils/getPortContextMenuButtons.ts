import type { PortContextMenuContext } from '../../../types'

type PortContextMenuButtons = {
    enablePin: boolean
    enableSetValue: boolean
    enablePickGeometry: boolean
}

export const getPortContextMenuButtons = (context: PortContextMenuContext): PortContextMenuButtons => {
    const { portTemplate } = context
    const { __direction: direction, typeName } = portTemplate

    const supportedPrimitiveTypeNames = [
        'number',
        'integer',
        'boolean',
        'text',
        'string'
    ]

    const supportedGeometricTypeNames = [
        'point',
        'circle',
        'curve',
        'line',
        'mesh',
        'surface',
        'extrusion',
    ]

    const enablePin = direction === 'input'
    const enableSetValue = direction === 'input' && supportedPrimitiveTypeNames.includes(typeName)
    const enablePickGeometry = direction === 'input' && supportedGeometricTypeNames.includes(typeName)

    return { enablePin, enableSetValue, enablePickGeometry }
}
