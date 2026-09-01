import React from 'react'
import { useStore } from '$'
import { shallow } from 'zustand/shallow'

import { GenericNode } from './generic-node'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import { GenericParameter } from './generic-parameter'
import NumberSlider from './number-slider/NumberSlider'
import Panel from './panel/Panel'
import ValueList from './value-list/ValueList'
import BooleanToggle from './boolean-toggle/BooleanToggle'
import ColorSwatch from './color-swatch/ColorSwatch'
import Gradient from './gradient/Gradient'
import { useFlag } from '@/hooks/useFlag'

const NodesContainer = (): React.ReactElement | null => {
    const nodeIds = useStore((store) => store.registry.documentNodeIds)
    const templates = useStore((store) => store.templates, shallow)

    const hideScript = useFlag('hideScript')

    if (hideScript) {
        return null
    }

    return (
        <g id="np-nodes" className="np-pointer-events-auto">
            {nodeIds.map((instanceId) => {
                const node = useStore.getState().document.nodes[instanceId]

                if (!node) {
                    return null
                }

                const { templateId } = node

                const template = templates[templateId]

                switch (getNodeTypeForTemplate(template)) {
                    case 'generic-node':
                        return <GenericNode key={`generic-node-${instanceId}`} id={instanceId} template={template} />
                    case 'generic-parameter':
                        return <GenericParameter key={`generic-parameter-${instanceId}`} id={instanceId} template={template} />
                    case 'number-slider':
                        return <NumberSlider key={`number-slider-${instanceId}`} id={instanceId} template={template} />
                    case 'panel':
                        return <Panel key={`panel-${instanceId}`} id={instanceId} template={template} />
                    case 'value-list':
                        return <ValueList key={`value-list-${instanceId}`} id={instanceId} template={template} />
                    case 'boolean-toggle':
                        return <BooleanToggle key={`boolean-toggle-${instanceId}`} id={instanceId} template={template} />
                    case 'color-swatch':
                        return <ColorSwatch key={`color-swatch-${instanceId}`} id={instanceId} template={template} />
                    case 'color-gradient':
                        return <Gradient key={`gradient-${instanceId}`} id={instanceId} template={template} />
                    // TODO: `unknown-node` type
                    case 'unknown':
                    default:
                        return null
                }
            })}
        </g>
    )
}

export default React.memo(NodesContainer)
