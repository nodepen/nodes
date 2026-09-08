import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import type { PortContextMenuContext } from '../../../types'
import { useStore } from '$'
import { PARAMS } from '@/constants'
import type * as NodePen from '@/types'

type PortContextMenuButtons = {
    enableSetLabel: boolean
    enablePinInput: boolean
    enablePinOutput: boolean
    enableSetValue: boolean
    enablePickGeometry: boolean
    enableZoomToGeometry: boolean
    enableReparameterize: boolean
}

export const getPortContextMenuButtons = (context: PortContextMenuContext): PortContextMenuButtons => {
    const { portTemplate, nodeInstanceId } = context
    const { __direction: direction, typeName } = portTemplate

    const node = useStore.getState().document.nodes[nodeInstanceId]
    const nodeType = getNodeTypeForTemplate(node ? useStore.getState().templates[node.templateId] : undefined)

    const supportedPrimitiveTypeNames: readonly string[] = PARAMS.PRIMITIVE
    const supportedGeometricTypeNames: readonly string[] = PARAMS.GEOMETRY

    const supportedReparameterizeTypeNames: readonly NodePen.DataTreeValueType[] = ['curve', 'surface']
    const enableReparameterize = supportedReparameterizeTypeNames.includes(typeName as NodePen.DataTreeValueType)

    switch (nodeType) {
        case 'generic-node': {
            return {
                enableSetLabel: false,
                enablePinInput: false,
                enablePinOutput: false,
                enableSetValue: false,
                enablePickGeometry: false,
                enableZoomToGeometry: direction === 'output',
                enableReparameterize
            }
        }
        case 'generic-parameter': {
            return {
                enableSetLabel: true,
                enableSetValue: supportedPrimitiveTypeNames.includes(typeName),
                enablePickGeometry: supportedGeometricTypeNames.includes(typeName),
                enablePinInput: true,
                enablePinOutput: true,
                enableZoomToGeometry: false,
                // TODO: Should be possible, need to see how to draw badge on param
                enableReparameterize: false
            }
        }
        case 'number-slider': {
            return {
                enableSetLabel: false,
                enableSetValue: false,
                enablePickGeometry: false,
                enablePinInput: true,
                enablePinOutput: false,
                enableZoomToGeometry: false,
                enableReparameterize: false
            }
        }
        case 'boolean-toggle': {
            return {
                enableSetLabel: false,
                enableSetValue: false,
                enablePickGeometry: false,
                enablePinInput: true,
                enablePinOutput: false,
                enableZoomToGeometry: false,
                enableReparameterize: false
            }
        }
        case 'color-gradient': {
            return {
                enableSetLabel: true,
                enableSetValue: false,
                enablePickGeometry: false,
                enablePinInput: false,
                enablePinOutput: false,
                enableZoomToGeometry: false,
                enableReparameterize: false
            }
        }
        default: {
            return {
                enableSetLabel: false,
                enablePinInput: false,
                enablePinOutput: false,
                enableSetValue: false,
                enablePickGeometry: false,
                enableZoomToGeometry: false,
                enableReparameterize: false
            }
        }
    }
}
