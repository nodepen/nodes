import React, { useCallback, useState } from 'react'
import { COLORS } from '@/constants'
import { hexToRgb, rgbToHex, type RGB } from '@/utils/color'

type ColorPickerProps = {
    value: RGB
    onSubmit: (value: RGB) => void
    onClose: () => void
}

export const ColorPicker = ({ value, onSubmit, onClose }: ColorPickerProps) => {
    const [rgb, setRgb] = useState<RGB>(value)
    const [hex, setHex] = useState<string>(() => rgbToHex(value))

    const handleChannelChange = useCallback((channel: keyof RGB, raw: string) => {
        const parsed = Number.parseInt(raw, 10)
        const next = Math.min(255, Math.max(0, Number.isNaN(parsed) ? 0 : parsed))

        setRgb((current) => {
            const updated = { ...current, [channel]: next }
            setHex(rgbToHex(updated))
            return updated
        })
    }, [])

    const handleHexChange = useCallback((raw: string) => {
        setHex(raw)

        const parsed = hexToRgb(raw)

        if (parsed) {
            setRgb(parsed)
        }
    }, [])

    const handleHexBlur = useCallback(() => {
        // Re-format whatever was typed to match the color it actually resolved to,
        // covering partial or invalid input left behind in the field.
        setHex(rgbToHex(rgb))
    }, [rgb])

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.select()
    }, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()

        if (e.key.toLowerCase() === 'enter') {
            e.preventDefault()
            e.currentTarget.blur()
        }
    }, [])

    const handleClose = useCallback(() => {
        onClose()
    }, [onClose])

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit(rgb)
    }, [rgb, onSubmit])

    return (
        <div className="np-w-64 np-p-0.5">
            <form onSubmit={handleSubmit}>
                <div className="np-w-full np-p-2 np-flex np-flex-col np-rounded-md np-border-2 np-border-dark">
                    <div
                        className="np-w-full np-h-12 np-mb-2 np-rounded-sm np-border-2 np-border-dark"
                        style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }}
                    />
                    {(['r', 'g', 'b'] as const).map((channel) => (
                        <div key={channel} className="np-w-full np-mt-2 first:np-mt-0 np-flex np-items-center np-justify-between">
                            <div className="np-text-sm np-text-dark np-font-sans np-uppercase">
                                {channel}
                            </div>
                            <input
                                className="np-h-8 np-w-36 np-ml-2 np-p-2 np-text-right np-text-xs np-font-sans np-rounded-sm np-border-2 np-border-dark no-focus"
                                type="number"
                                min={0}
                                max={255}
                                value={rgb[channel]}
                                onChange={(e) => handleChannelChange(channel, e.currentTarget.value)}
                                onFocus={handleFocus}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    ))}
                </div>
                <div className="np-w-full np-mt-0.5 np-p-2 np-flex np-items-center np-justify-between np-rounded-md np-border-2 np-border-dark">
                    <div className="np-text-sm np-text-dark np-font-sans">
                        Hex
                    </div>
                    <input
                        className="np-h-8 np-w-36 np-ml-2 np-p-2 np-text-right np-text-xs np-font-sans np-rounded-sm np-border-2 np-border-dark no-focus"
                        value={hex}
                        onChange={(e) => handleHexChange(e.currentTarget.value)}
                        onBlur={handleHexBlur}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="np-w-full np-p-2 np-flex np-items-center np-justify-end">
                    <div className="np-w-6 np-h-6 np-mr-2 np-flex np-items-center np-justify-center np-rounded-full np-border-2 np-border-dark hover:np-bg-grey hover:np-cursor-pointer" onClick={handleClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" vectorEffect="non-scaling-stroke" />
                        </svg>
                    </div>
                    <button type="submit" className="np-w-6 np-h-6 np-flex np-items-center np-justify-center np-rounded-full np-border-2 np-border-dark hover:np-bg-grey hover:np-cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" vectorEffect="non-scaling-stroke" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    )
}
