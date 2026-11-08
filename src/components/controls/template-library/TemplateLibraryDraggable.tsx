import React, { useCallback, useRef } from 'react'
import type * as NodePen from '@/types'
import { createInstance, getIconAsImage, applyFallbackIcon } from '@/utils/templates'
import { isLocked } from '@/utils/templates/isLocked'
import { useLongHover, usePageSpaceToOverlaySpace, usePageSpaceToWorldSpace } from '@/hooks'
import { useCallbacks, useDispatch, useStore } from '$'
import { addDocumentNode } from '@/store/utils'
import { COLORS, KEYS } from '@/constants'

type TemplateDraggableProps = {
    template: NodePen.NodeTemplate
    showTooltip?: boolean
}

const TemplateDraggable = ({ template, showTooltip }: TemplateDraggableProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null)

    const { apply, clearInterface } = useDispatch()
    const { onSelectLockedTemplate } = useCallbacks()

    const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()
    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const handlePointerDown = useCallback(
        (e: React.PointerEvent<HTMLButtonElement>): void => {
            switch (e.pointerType) {
                case 'mouse': {
                    e.stopPropagation()

                    clearInterface()

                    if (isLocked(template.guid)) {
                        onSelectLockedTemplate?.(useStore.getState(), { templateId: template.guid })
                        return
                    }

                    const { pageX, pageY } = e

                    const [x, y] = pageSpaceToWorldSpace(pageX, pageY)

                    const node = createInstance(template, useStore.getState().ui.preferences)

                    apply((state) => {
                        node.status.isProvisional = true
                        node.position = {
                            x: x - node.dimensions.width / 2,
                            y: y - node.dimensions.height / 2,
                        }

                        addDocumentNode(state, node)

                        state.layout.nodePlacement = {
                            isActive: true,
                            activeNodeId: node.instanceId,
                            openOnEnd: state.ui.sidebar.isAgentOpen ? ['agent'] : [],
                        }
                    })
                    break
                }
                case 'pen':
                case 'touch': {

                }
            }
        },
        [apply, onSelectLockedTemplate, pageSpaceToWorldSpace]
    )

    const handleLongHover = useCallback(
        (_e: PointerEvent): void => {
            const element = buttonRef.current

            if (!element || !showTooltip) {
                return
            }

            const { top } = element.getBoundingClientRect()

            const [_x, y] = pageSpaceToOverlaySpace(0, top)

            apply((state) => {
                state.registry.tooltips[KEYS.TOOLTIPS.TEMPLATE_LIBRARY_CONTROL_OPTION_HOVER] = {
                    configuration: {
                        position: {
                            x: 318,
                            y: y - 6,
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
        [apply, showTooltip]
    )

    const longHoverTarget = useLongHover<HTMLDivElement>(handleLongHover)

    return (
        <div ref={longHoverTarget} key={`drag-${template.guid}`} className="np-w-full np-pt-[100%] np-relative np-rounded-sm hover:np-bg-grey">
            <button
                key={`template-library-template-icon-${template.guid}`}
                ref={buttonRef}
                onPointerDown={handlePointerDown}
                className="np-absolute np-w-full np-top-0 np-right-0 np-left-0 np-bottom-0"
            >
                <div className="np-w-full np-h-full np-flex np-items-center np-justify-center">
                    <img
                        width={22}
                        draggable={false}
                        src={getIconAsImage(template)}
                        onError={applyFallbackIcon}
                        alt={`${template.name} (${template.nickName}): ${template.description}${template.isLocked ? ' (Locked)' : ''}`}
                    />
                </div>
                {template.isLocked ? (
                    <div className="np-absolute np-top-0 np-right-0 np-pointer-events-none">
                        <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={COLORS.DARK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="5" y="11" width="14" height="10" rx="2" vectorEffect="non-scaling-stroke" />
                            <path d="M8 11V7a4 4 0 0 1 8 0v4" vectorEffect="non-scaling-stroke" />
                        </svg>
                    </div>
                ) : null}
            </button>
        </div>
    )
}

const propsAreEqual = (prevProps: TemplateDraggableProps, nextProps: TemplateDraggableProps): boolean => {
    return prevProps.template.guid === nextProps.template.guid
}

export default React.memo(TemplateDraggable, propsAreEqual)
