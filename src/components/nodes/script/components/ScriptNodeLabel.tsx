import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { useLongHover, usePageSpaceToOverlaySpace } from '@/hooks'
import { useDispatch } from '$'
import { useNodeInternalState } from '../../context/node-state'
import { getScriptNodeLanguage } from '@/utils/templates/getScriptNodeLanguage'

const { NODE_LABEL_WIDTH, SCRIPTING_COMPONENT_LABEL_FONT_SIZE } = DIMENSIONS

const LANGUAGE_LABELS: Record<NodePen.ScriptNodeLanguage, string> = {
    csharp: 'C#',
    python3: 'PY',
}

type ScriptNodeLabelProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const ScriptNodeLabel = ({ node, template }: ScriptNodeLabelProps) => {
    const { position } = useNodeInternalState()

    const { dx } = node.anchors['labelDeltaX']

    const { apply } = useDispatch()

    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const handleLongHover = useCallback(
        (e: PointerEvent): void => {
            const { pageX, pageY } = e

            const [x, y] = pageSpaceToOverlaySpace(pageX, pageY)

            apply((state) => {
                state.registry.tooltips[`graph-node-${node.instanceId}`] = {
                    configuration: {
                        position: {
                            x: x + 8,
                            y: y + 8,
                        },
                        isSticky: false,
                    },
                    context: {
                        type: 'node-template-summary',
                        template,
                    },
                }
            })
        },
        [pageSpaceToOverlaySpace]
    )

    const longHoverTarget = useLongHover<SVGGElement>(handleLongHover)

    const language = getScriptNodeLanguage(template.guid)
    const label = language ? LANGUAGE_LABELS[language] : template.nickName.toUpperCase()

    const cx = position.x + dx
    const cy = position.y + node.dimensions.height / 2

    return (
        <>
            <g id={`node-label-${node.instanceId}`} ref={longHoverTarget} className="np-pointer-events-auto">
                <rect
                    x={cx - NODE_LABEL_WIDTH / 2}
                    y={cy - NODE_LABEL_WIDTH / 2}
                    width={NODE_LABEL_WIDTH}
                    height={NODE_LABEL_WIDTH}
                    rx={7}
                    ry={7}
                    fill={COLORS.LIGHT}
                    stroke={COLORS.DARK}
                    strokeWidth={2}
                />
            </g>
            <text
                x={cx}
                y={cy}
                className="np-font-panel np-font-[800] np-select-none np-pointer-events-none"
                fill={COLORS.DARK}
                fontSize={SCRIPTING_COMPONENT_LABEL_FONT_SIZE}
                textAnchor="middle"
                dominantBaseline="central"
            >
                {label}
            </text>
        </>
    )
}
