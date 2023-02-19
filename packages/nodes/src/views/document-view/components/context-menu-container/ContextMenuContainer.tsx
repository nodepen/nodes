import React from 'react'
import { useStore } from '$'
import { PortContextMenu } from './menus'
import { getMenuHeight } from './utils'
import { useReducedMotion } from '@/hooks'

const ContextMenuContainer = () => {
    const menus = useStore((state) => Object.entries(state.registry.contextMenus))
    const prefersReducedMotion = useReducedMotion()

    return (
        <div className="np-w-full np-h-full np-pointer-events-none np-relative">
            {menus.map(([key, menu]) => {
                const contextType = menu.context.type

                if (!prefersReducedMotion) {
                    const menuHeight = getMenuHeight(menu.context)
                    document.documentElement.style.setProperty('--np-active-menu-height', `${menuHeight}px`)
                }

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

