type NodePenCSSVariable = '--np-active-menu-height'

export const trySetVariable = (variable: NodePenCSSVariable, value: string): void => {
    switch (variable) {
        case '--np-active-menu-height': {
            // TODO: Detect prefers-reduced-motion and skip animation
            // const currentValue = document.documentElement.style.getPropertyValue(variable)
            document.documentElement.style.setProperty('--np-active-menu-height', value)
            break
        }
        default: {
            console.log(`🐍 Unhandled css variable ${variable}`)
            break
        }
    }
}