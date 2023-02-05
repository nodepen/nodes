import React from 'react'
import { useDispatch, useStore } from '$'
import type { ContextMenu, PortContextMenuContext } from '../types'

type PortContextMenuProps = {
    position: ContextMenu['position']
    context: PortContextMenuContext
}

export const PortContextMenu = ({ position, context }: PortContextMenuProps) => {
    const { nodeInstanceId, portInstanceId, portTemplate } = context
    const { x: left, y: top } = position
    const { __direction: direction } = portTemplate

    const { apply } = useDispatch()

    const isPinned = useStore((state) => state.document.configuration.pinnedPorts.some((pin) => pin.nodeInstanceId === nodeInstanceId && pin.portInstanceId === portInstanceId))
    const isPinnable = direction === 'input'

    return (
        <div className="np-absolute np-p-4 np-bg-light np-rounded-md np-shadow-main np-pointer-events-auto" style={{ left, top }}>
            {isPinnable
                ? isPinned
                    ? <button onClick={(e) => {
                        apply((state) => {
                            state.document.configuration.pinnedPorts = state.document.configuration.pinnedPorts.filter((pin) => {
                                const sameNode = pin.nodeInstanceId === nodeInstanceId
                                const samePort = pin.portInstanceId === portInstanceId

                                return !sameNode && !samePort
                            })
                        })
                    }}>Unpin!</button>
                    : <button onClick={() => {
                        apply((state) => {
                            state.document.configuration.pinnedPorts.push({
                                nodeInstanceId,
                                portInstanceId
                            })
                        })
                    }}>Pin!</button>
                : null
            }
        </div>
    )
}

export default PortContextMenu