import React from 'react'
import { useStore } from '$'
import { PortContextMenu } from './menus'

const ContextMenuContainer = () => {
    const menus = useStore((state) => Object.entries(state.registry.contextMenus))

    return (
        <div className="np-w-full np-h-full np-pointer-events-none np-relative">
            {menus.map(([key, menu]) => {
                const contextType = menu.context.type

                switch (contextType) {
                    case 'port': {
                        return <PortContextMenu key={`context-menu-${key}`} position={menu.position} context={menu.context} />
                    }
                    case 'root': {
                        return null
                    }
                    default: {
                        console.log(`🐍 Unhandled context menu type [${contextType}]`)
                        return null
                    }
                }
            })}
        </div>
    )
}

export default React.memo(ContextMenuContainer)

