import type React from 'react'
import type * as NodePen from '@/types'
import { COLORS } from '@/constants'

export const TEMPLATE_ICON_FALLBACK = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="${COLORS.DARK}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`
)}`

export const getIconAsImage = (template: NodePen.NodeTemplate): string => {
    const { icon } = template

    const isBase64 = /^[A-Za-z0-9+/]+={0,2}$/

    if (!icon || !isBase64.test(icon)) {
        return TEMPLATE_ICON_FALLBACK
    }

    return `data:image/png;base64,${icon}`
}

export const applyFallbackIcon = (e: React.SyntheticEvent<HTMLImageElement | SVGImageElement>): void => {
    const target = e.currentTarget
    const attribute = target instanceof SVGImageElement ? 'href' : 'src'

    if (target.getAttribute(attribute) === TEMPLATE_ICON_FALLBACK) {
        return
    }

    target.setAttribute(attribute, TEMPLATE_ICON_FALLBACK)
}
