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

const NUM = '(-?\\d+(?:\\.\\d+)?)'

const patterns = {
    panel: /^"(.*)$/,
    panel2: /^\/\/(.*)$/,
    numberSliderValue: new RegExp(`${NUM}`),
    numberSliderMaximum: new RegExp(`^${NUM}<${NUM}$`),
    numberSliderRange: new RegExp(`^${NUM}<${NUM}<${NUM}$`),
    // domain: new RegExp(`^${NUM}\\s+[Tt]o\\s+${NUM}$`),
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

    const numericValue = clamp(Number.parseFloat(value), -1_000_00, 1_000_000)

    const maxAbs = Math.pow(10, numericValue.toString().length)

    const n = Number.parseFloat(valueString)

    return {
        min: numericValue > 0 ? 0 : -maxAbs,
        max: numericValue > 0 ? maxAbs : 0,
        precision,
        value: n.toFixed(precision)
    }
}