import type * as NodePen from '@/types'
import React, { useCallback } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useDispatch } from '@/store'
import { expireSolution } from '@/store/utils'
import { tryGetSingleValue } from '@/utils/data-trees'
import { createSingleValue } from '@/utils/data-trees/createSingleValue'
import { clamp } from '@/utils/numerics'
import { COLORS } from '@/constants'

type ConfigFormData = {
    xMin: string
    xMax: string
    yMin: string
    yMax: string
}

type ConfigProps = {
    node: NodePen.DocumentNode
    config: NodePen.MDSliderConfig
    onClose: () => void
}

const parseDomain = (min: string, max: string, fallback: NodePen.MDSliderDomain): NodePen.MDSliderDomain => {
    const a = Number.parseFloat(min)
    const b = Number.parseFloat(max)

    const parsedMin = Number.isFinite(a) ? a : fallback.min
    const parsedMax = Number.isFinite(b) ? b : fallback.max

    return {
        min: Math.min(parsedMin, parsedMax),
        max: Math.max(parsedMin, parsedMax),
    }
}

export const MDSliderConfigForm = ({ node, config, onClose }: ConfigProps) => {
    const { apply } = useDispatch()

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
    } = useForm<ConfigFormData>({
        defaultValues: {
            xMin: config.x.min.toString(),
            xMax: config.x.max.toString(),
            yMin: config.y.min.toString(),
            yMax: config.y.max.toString(),
        }
    })

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

    const handleBlur = useCallback(() => {
        const current = getValues()

        const x = parseDomain(current.xMin, current.xMax, config.x)
        const y = parseDomain(current.yMin, current.yMax, config.y)

        const next: ConfigFormData = {
            xMin: x.min.toString(),
            xMax: x.max.toString(),
            yMin: y.min.toString(),
            yMax: y.max.toString(),
        }

        for (const key of Object.keys(next) as (keyof ConfigFormData)[]) {
            if (next[key] !== current[key]) {
                setValue(key, next[key], { shouldDirty: true })
            }
        }
    }, [getValues, setValue, config.x, config.y])

    const onSubmit: SubmitHandler<ConfigFormData> = (data) => {
        const x = parseDomain(data.xMin, data.xMax, config.x)
        const y = parseDomain(data.yMin, data.yMax, config.y)

        apply((state) => {
            const currentNode = state.document.nodes[node.instanceId]

            if (!currentNode) {
                return
            }

            const currentConfig = currentNode.nodeConfiguration as NodePen.MDSliderConfig

            currentNode.nodeConfiguration = {
                ...currentConfig,
                x,
                y,
            } as NodePen.MDSliderConfig

            const [px = '0', py = '0', pz = '0'] = (tryGetSingleValue(currentNode.values['input'])?.value ?? '').split(',')
            const nextX = clamp(Number.parseFloat(px) || 0, x.min, x.max)
            const nextY = clamp(Number.parseFloat(py) || 0, y.min, y.max)

            currentNode.values['input'] = createSingleValue(`${nextX},${nextY},${pz.trim()}`, 'point')

            expireSolution(state)
        })

        onClose()
    }

    const inputClassName = 'np-h-8 np-w-20 np-p-2 np-text-right np-text-xs np-font-sans np-rounded-sm np-border-2 np-border-dark no-focus'

    const renderDomainRow = (label: string, minKey: keyof ConfigFormData, maxKey: keyof ConfigFormData, className = '') => (
        <div className={`np-w-full np-flex np-items-center np-justify-between ${className}`}>
            <div className='np-text-sm np-text-dark np-font-sans'>
                {label}
            </div>
            <div className='np-flex np-items-center'>
                <input
                    className={inputClassName}
                    {...register(minKey)}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                />
                <div className='np-mx-2 np-text-sm np-text-dark np-font-sans'>
                    to
                </div>
                <input
                    className={inputClassName}
                    {...register(maxKey)}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    )

    return (
        <div className="np-w-80 np-p-0.5">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='np-w-full np-p-2 np-flex np-flex-col np-rounded-md np-border-2 np-border-dark'>
                    {renderDomainRow('X Domain', 'xMin', 'xMax')}
                    {renderDomainRow('Y Domain', 'yMin', 'yMax', 'np-mt-2')}
                </div>
                <div className='np-w-full np-p-2 np-flex np-items-center np-justify-end'>
                    <div className="np-w-6 np-h-6 np-mr-2 np-flex np-items-center np-justify-center np-rounded-full np-border-2 np-border-dark hover:np-bg-grey hover:np-cursor-pointer" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" vectorEffect="non-scaling-stroke" />
                        </svg>
                    </div>
                    <button type='submit' className="np-w-6 np-h-6 np-flex np-items-center np-justify-center np-rounded-full np-border-2 np-border-dark hover:np-bg-grey hover:np-cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" vectorEffect="non-scaling-stroke" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    )
}
