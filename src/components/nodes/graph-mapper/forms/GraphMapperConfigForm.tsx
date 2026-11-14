import type * as NodePen from '@/types'
import React, { useCallback } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useDispatch } from '@/store'
import { expireSolution } from '@/store/utils'
import { COLORS } from '@/constants'

type ConfigFormData = {
    sourceMin: string
    sourceMax: string
    targetMin: string
    targetMax: string
}

type ConfigProps = {
    node: NodePen.DocumentNode
    config: NodePen.GraphMapperConfig
    onClose: () => void
}

const parseDomain = (min: string, max: string, fallback: NodePen.GraphMapperDomain): NodePen.GraphMapperDomain => {
    const a = Number.parseFloat(min)
    const b = Number.parseFloat(max)

    const parsedMin = Number.isFinite(a) ? a : fallback.min
    const parsedMax = Number.isFinite(b) ? b : fallback.max

    return {
        min: Math.min(parsedMin, parsedMax),
        max: Math.max(parsedMin, parsedMax),
    }
}

export const GraphMapperConfigForm = ({ node, config, onClose }: ConfigProps) => {
    const { apply } = useDispatch()

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
    } = useForm<ConfigFormData>({
        defaultValues: {
            sourceMin: config.domain.source.min.toString(),
            sourceMax: config.domain.source.max.toString(),
            targetMin: config.domain.target.min.toString(),
            targetMax: config.domain.target.max.toString(),
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

        const source = parseDomain(current.sourceMin, current.sourceMax, config.domain.source)
        const target = parseDomain(current.targetMin, current.targetMax, config.domain.target)

        const next: ConfigFormData = {
            sourceMin: source.min.toString(),
            sourceMax: source.max.toString(),
            targetMin: target.min.toString(),
            targetMax: target.max.toString(),
        }

        for (const key of Object.keys(next) as (keyof ConfigFormData)[]) {
            if (next[key] !== current[key]) {
                setValue(key, next[key], { shouldDirty: true })
            }
        }
    }, [getValues, setValue, config.domain.source, config.domain.target])

    const onSubmit: SubmitHandler<ConfigFormData> = (data) => {
        const source = parseDomain(data.sourceMin, data.sourceMax, config.domain.source)
        const target = parseDomain(data.targetMin, data.targetMax, config.domain.target)

        apply((state) => {
            const currentNode = state.document.nodes[node.instanceId]

            if (!currentNode) {
                return
            }

            const currentConfig = currentNode.nodeConfiguration as NodePen.GraphMapperConfig

            currentNode.nodeConfiguration = {
                ...currentConfig,
                domain: {
                    source,
                    target,
                },
            } as NodePen.GraphMapperConfig

            expireSolution(state)
        })

        onClose()
    }

    const inputClassName = 'np-h-8 np-w-20 np-p-2 np-text-right np-text-xs np-font-sans np-rounded-sm np-border-2 np-border-dark no-focus'

    const renderDomainRow = (label: string, minKey: keyof ConfigFormData, maxKey: keyof ConfigFormData, className = '') => {
        return (
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
    }

    return (
        <div className="np-w-80 np-p-0.5">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='np-w-full np-p-2 np-flex np-flex-col np-rounded-md np-border-2 np-border-dark'>
                    {renderDomainRow('Source', 'sourceMin', 'sourceMax')}
                    {renderDomainRow('Target', 'targetMin', 'targetMax', 'np-mt-2')}
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
