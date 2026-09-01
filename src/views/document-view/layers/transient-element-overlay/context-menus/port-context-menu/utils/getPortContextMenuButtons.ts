import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import type { PortContextMenuContext } from '../../../types'
import { useStore } from '$'
import { PARAMS } from '@/constants'
import type * as NodePen from '@/types'

type PortContextMenuButtons = {
    enableSetLabel: boolean
    enablePin: boolean
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
                enablePin: false,
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
                enablePin: true,
                enableZoomToGeometry: false,
                // TODO: This should be possible
                enableReparameterize: false
            }
        }
        case 'number-slider': {
            return {
                enableSetLabel: false,
                enableSetValue: false,
                enablePickGeometry: false,
                enablePin: true,
                enableZoomToGeometry: false,
                enableReparameterize: false
            }
        }
        case 'boolean-toggle': {
            return {
                enableSetLabel: false,
                enableSetValue: false,
                enablePickGeometry: false,
                enablePin: true,
                enableZoomToGeometry: false,
                enableReparameterize: false
            }
        }
        case 'color-gradient': {
            return {
                enableSetLabel: true,
                enableSetValue: false,
                enablePickGeometry: false,
                enablePin: false,
                enableZoomToGeometry: false,
                enableReparameterize: false
            }
        }
        default: {
            return {
                enableSetLabel: false,
                enablePin: false,
                enableSetValue: false,
                enablePickGeometry: false,
                enableZoomToGeometry: false,
                enableReparameterize: false
            }
        }
    }
}
