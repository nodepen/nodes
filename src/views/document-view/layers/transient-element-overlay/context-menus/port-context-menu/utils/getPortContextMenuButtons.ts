import type { PortContextMenuContext } from '../../../types'

type PortContextMenuButtons = {
    enablePin: boolean
    enableSetValue: boolean
    enablePickGeometry: boolean
    enableZoomToGeometry: boolean
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
        'brep'
    ]

    const enablePin = direction === 'input'
    const enableSetValue = direction === 'input' && supportedPrimitiveTypeNames.includes(typeName)

    const enablePickGeometry = direction === 'input' && supportedGeometricTypeNames.includes(typeName)
    const enableZoomToGeometry = direction === 'output'

    return { enablePin, enableSetValue, enablePickGeometry, enableZoomToGeometry }
}
