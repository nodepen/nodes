import { useLongHover } from "@/hooks"
import { useDispatch } from "@/store"
import { newGuid } from "@/utils/common"
import type { GenericTextTooltipContext } from "@/views/document-view/layers/transient-element-overlay/types/TooltipContext"
import React, { useCallback, useEffect, useId, useRef } from "react"

type Props = React.PropsWithChildren<{
    size?: 'sm' | 'lg'
    tooltip?: string
    tooltipDirection?: 'top' | 'right'
    tooltipHotkeys?: string[]
    shadow?: boolean
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}>

export const CircleButton = ({ children, ...props }: Props) => {
    const {
        size = 'sm',
        shadow = false,
        tooltip = '',
        tooltipDirection = 'top',
        tooltipHotkeys,
        onClick
    } = props

    const buttonRef = useRef<HTMLDivElement>(null)
    const tooltipKey = useRef(`circle-button-${newGuid()}`)

    const { apply, clearInterface } = useDispatch()

    const activeTimeout = useRef<ReturnType<typeof setTimeout>>(null)
    const tooltipIsVisible = useRef(false)

    const updateTooltip = useCallback(() => {
        const buttonEl = buttonRef.current

        if (!buttonEl) {
            return
        }

        if (!tooltip) {
            return
        }

        const { left, width, top, height } = buttonEl.getBoundingClientRect()

        const cx = left + (width / 2)
        const cy = top + (height / 2)

        const x = tooltipDirection === 'top' ? cx : cx + 72
        const y = tooltipDirection === 'top' ? cy + ((height / -2) - 20) : cy

        apply((state) => {
            state.registry.tooltips[tooltipKey.current] = {
                configuration: {
                    position: {
                        x,
                        y
                    },
                    isSticky: true
                },
                context: {
                    type: 'generic-text',
                    textContent: tooltip,
                    hotkeys: tooltipHotkeys
                }
            }
        })
    }, [tooltip, tooltipHotkeys])

    useEffect(() => {
        if (tooltipIsVisible.current) {
            updateTooltip()
        }
    }, [tooltip, tooltipHotkeys])

    const handlePointerEnter = useCallback((_e: React.PointerEvent<HTMLDivElement>) => {
        activeTimeout.current = setTimeout(() => {
            tooltipIsVisible.current = true
            updateTooltip()
        }, 150);
    }, [updateTooltip])

    const handlePointerLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (activeTimeout.current) {
            clearTimeout(activeTimeout.current)
            activeTimeout.current = null
        }

        apply((state) => {
            delete state.registry.tooltips[tooltipKey.current]
        })

        tooltipIsVisible.current = false
    }, [])

    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        clearInterface()
        onClick?.(e)
    }, [onClick])

    return <div ref={buttonRef} className={`${size === 'sm' ? 'np-w-8 np-h-8' : 'np-w-12 np-h-12'} ${shadow ? 'np-shadow-main' : ''} np-p-0.5 np-flex np-items-center np-justify-center np-rounded-full np-bg-light np-pointer-events-auto np-group hover:np-cursor-pointer`} onClick={handleClick} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave} >
        <div className="np-w-full np-h-full np-p-0.5 np-flex np-items-center np-justify-center np-rounded-full np-border-2 np-border-dark ">
            <div className="np-w-full np-h-full np-flex np-items-center np-justify-center np-rounded-full group-hover:np-bg-grey">
                {children}
            </div>
        </div>
    </div>
}