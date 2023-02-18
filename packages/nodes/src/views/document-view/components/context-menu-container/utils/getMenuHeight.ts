import type { ContextMenuContext } from '../types'

export const getMenuHeight = (context: ContextMenuContext): number => {
    switch (context.type) {
        case 'port': {
            const { direction } = context
            return direction === 'input' ? 225 : 150
        }
        default: {
            return 5
        }
    }
}