import type { ContextMenuContext } from '../types'
import { getPortContextMenuButtons } from '../menus/port-context-menu/utils'

export const getMenuHeight = (context: ContextMenuContext): number => {
    switch (context.type) {
        case 'port': {
            const { direction } = context

            const baseHeight = 150

            switch (direction) {
                case 'input': {
                    const { enablePin, enableSetValue } = getPortContextMenuButtons(context)

                    const multiplier = [enablePin, enableSetValue].filter((check) => !!check).length

                    return baseHeight + (36 * multiplier)
                }
                case 'output': {
                    return baseHeight
                }
                default: {
                    return baseHeight
                }
            }
        }
        default: {
            return 5
        }
    }
}