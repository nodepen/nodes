import { COMPONENTS } from '@/constants'
import type * as NodePen from '@/types'
import { clamp } from '../numerics'

export type TemplateMatch =
    | {
        type: 'panel'
        templateId: string
        config: NodePen.PanelConfig
    }
    | {
        type: 'number-slider'
        templateId: string
        value: string
        config: NodePen.NumberSliderConfig
    }
    | {
        type: 'point'
        templateId: string
        value: [x: number, y: number, z: number]
    }
    | {
        type: 'addition' | 'subtraction' | 'multiplication' | 'division',
        templateId: string
        // The value to set as the "B" value
        value?: string
    }

const NUM = '(-?\\d+(?:\\.\\d+)?)'

const patterns = {
    panel: /"([^"]*)"?$/,
    // panel: /^"(.*)$/,
    panel2: /^\/\/(.*)$/,
    numberSliderValue: new RegExp(`${NUM}`),
    numberSliderMaximum: new RegExp(`^${NUM}(?:<|\.\.)${NUM}$`),
    numberSliderRange: new RegExp(`^${NUM}<${NUM}<${NUM}$`),
    addition: /^\+(-?\d+(\.\d+)?)?$/,
    subraction: /^\-(-?\d+(\.\d+)?)?$/,
    multiplication: /^\*(-?\d+(\.\d+)?)?$/,
    division: /^\/(-?\d+(\.\d+)?)?$/,
    point2d: new RegExp(`^${NUM},${NUM},?$`),
    point3d: new RegExp(`^${NUM},${NUM},${NUM}$`)
}

export const tryMatchTextSearch = (search: string): TemplateMatch | null => {
    const s = search.trim()

    let m: RegExpMatchArray | null

    if ((m = s.match(patterns.panel))) {
        const textContent = m[1]

        return {
            type: 'panel',
            templateId: COMPONENTS.PANEL,
            config: {
                textContent,
                multilineData: false
            }
        }
    }

    if ((m = s.match(patterns.panel2))) {
        const textContent = m[1]

        return {
            type: 'panel',
            templateId: COMPONENTS.PANEL,
            config: {
                textContent,
                multilineData: false
            }
        }
    }

    if ((m = s.match(patterns.point2d))) {
        const x = Number.parseFloat(m[1] ?? '0')
        const y = Number.parseFloat(m[2] ?? '0')

        return {
            type: 'point',
            templateId: COMPONENTS.CONSTRUCT_POINT,
            value: [x, y, 0]
        }
    }

    if ((m = s.match(patterns.point3d))) {
        const x = Number.parseFloat(m[1] ?? '0')
        const y = Number.parseFloat(m[2] ?? '0')
        const z = Number.parseFloat(m[3] ?? '0')

        return {
            type: 'point',
            templateId: COMPONENTS.CONSTRUCT_POINT,
            value: [x, y, z]
        }
    }

    if ((m = s.match(patterns.addition))) {
        const value = m[1]

        return {
            type: 'addition',
            templateId: COMPONENTS.ADDITION,
            value
        }
    }

    if ((m = s.match(patterns.subraction))) {
        const value = m[1]

        return {
            type: 'subtraction',
            templateId: COMPONENTS.SUBTRACTION,
            value
        }
    }

    if ((m = s.match(patterns.multiplication))) {
        const value = m[1]

        return {
            type: 'multiplication',
            templateId: COMPONENTS.MULTIPLICATION,
            value
        }
    }

    if ((m = s.match(patterns.division))) {
        const value = m[1]

        return {
            type: 'division',
            templateId: COMPONENTS.DIVISION,
            value
        }
    }

    if ((m = s.match(patterns.numberSliderRange))) {
        const n = Number.parseFloat(m[2])
        const min = Number.parseFloat(m[1])
        const max = Number.parseFloat(m[3])
        const config = decomposeNumber(m[2])

        return {
            type: 'number-slider',
            templateId: COMPONENTS.NUMBER_SLIDER,
            value: n.toFixed(config.precision),
            config: {
                min,
                max,
                precision: config.precision
            }
        }
    }

    if ((m = s.match(patterns.numberSliderMaximum))) {
        const n = Number.parseFloat(m[1])
        const max = Number.parseFloat(m[2])
        const config = decomposeNumber(m[1])

        return {
            type: 'number-slider',
            templateId: COMPONENTS.NUMBER_SLIDER,
            value: n.toFixed(config.precision),
            config: {
                ...config,
                max
            }
        }
    }

    if ((m = s.match(patterns.numberSliderValue))) {
        const n = Number.parseFloat(m[1])
        const config = decomposeNumber(m[1])

        return {
            type: 'number-slider',
            templateId: COMPONENTS.NUMBER_SLIDER,
            value: n.toFixed(config.precision),
            config
        }
    }

    return null
}

const decomposeNumber = (valueString: string): NodePen.NumberSliderConfig & { value: string } => {
    const fragments = valueString?.split('.')

    const value = fragments?.at(0) ?? '0'
    const decimals = fragments?.at(1) ?? ''

    const precision = clamp(decimals.length, 0, 4) as 0 | 1 | 2 | 3

    const numericValue = clamp(Number.parseFloat(value), -1_000_000, 1_000_000)

    const maxAbs = Math.pow(10, numericValue === 0 ? 0 : numericValue.toString().length)

    const n = Number.parseFloat(valueString)

    return {
        min: numericValue >= 0 ? 0 : -maxAbs,
        max: numericValue >= 0 ? maxAbs : 0,
        precision,
        value: n.toFixed(precision)
    }
}