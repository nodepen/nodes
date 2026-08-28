import type * as NodePen from '@/types'
import { tryGetSingleValue } from '@/utils/data-trees'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm, type SubmitHandler } from "react-hook-form"
import { PrecisionInput } from './PrecisionInput'
import { clamp } from '@/utils'
import { useDispatch } from '@/store'
import { createSingleValue } from '@/utils/data-trees/createSingleValue'
import { expireSolution } from '@/store/utils'
import { COLORS } from '@/constants'

type ConfigFormData = {
    min: string
    max: string
    value: string
}

type ConfigProps = {
    node: NodePen.DocumentNode
    config: NodePen.NumberSliderConfig
    onClose: () => void
}

export const NumberSliderConfigForm = ({ node, config, onClose }: ConfigProps) => {
    const { min, max, precision } = config
    const initialValue = tryGetSingleValue(node.values['input'])?.value ?? tryGetSingleValue(node.values['output'])?.value ?? '0'

    const { apply } = useDispatch()

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        setFocus
    } = useForm<ConfigFormData>({
        defaultValues: {
            min: min.toFixed(precision),
            max: max.toFixed(precision),
            value: initialValue,
        }
    })

    useEffect(() => {
        setFocus('value')
    }, [])

    const [internalPrecision, setInternalPrecision] = useState(precision)
    const setPrecision = useCallback((value: typeof precision) => {
        setInternalPrecision(value)

        const current = getValues()
        const minValue = Number.parseFloat(current.min)
        const maxValue = Number.parseFloat(current.max)
        const valueValue = Number.parseFloat(current.value)

        setValue('min', minValue.toFixed(value))
        setValue('max', maxValue.toFixed(value))
        setValue('value', valueValue.toFixed(value))
    }, [getValues, setValue])

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.select()
    }, [])
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()

        switch (e.key.toLowerCase()) {
            case 'enter': {
                e.preventDefault();
                e.currentTarget.blur();
                break
            }
            case 'del':
            case 'delete': {
                e.stopPropagation()
                e.nativeEvent.stopImmediatePropagation()
                break
            }
        }
    }, [])
    const handleBlur = useCallback(() => {
        const current = getValues()
        let minValue = Number.parseFloat(current.min)
        let maxValue = Number.parseFloat(current.max)
        let valueValue = Number.parseFloat(current.value)

        if (Number.isNaN(minValue)) {
            minValue = config.min
        }
        if (Number.isNaN(maxValue)) {
            maxValue = config.max
        }
        if (Number.isNaN(valueValue)) {
            valueValue = Number.parseFloat(initialValue)
        }

        const normalizedMin = Math.min(minValue, maxValue)
        const normalizedMax = Math.max(minValue, maxValue)
        const normalizedValue = clamp(valueValue, normalizedMin, normalizedMax)

        if (normalizedMin.toFixed(internalPrecision) !== current.min) {
            setValue('min', normalizedMin.toFixed(internalPrecision), { shouldDirty: true })
        }

        if (normalizedMax.toFixed(internalPrecision) !== current.max) {
            setValue('max', normalizedMax.toFixed(internalPrecision), { shouldDirty: true })
        }

        if (normalizedValue.toFixed(internalPrecision) !== current.value) {
            setValue('value', normalizedValue.toFixed(internalPrecision), { shouldDirty: true })
        }
    }, [getValues, setValue, internalPrecision, config.min, config.max, config.precision, initialValue])

    const onSubmit: SubmitHandler<ConfigFormData> = (data) => {
        apply((state) => {
            const currentNode = state.document.nodes[node.instanceId]

            if (!currentNode) {
                return
            }

            currentNode.values['input'] = createSingleValue(data.value, 'number')
            currentNode.nodeConfiguration = {
                min: Number.parseFloat(data.min),
                max: Number.parseFloat(data.max),
                precision: internalPrecision
            }
            expireSolution(state)
        })
        onClose()
    }

    const handleClose = useCallback(() => {
        onClose()
    }, [])

    return (
        <div className="np-w-64 np-p-0.5">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='np-w-full np-p-2 np-flex np-flex-col np-rounded-md np-border-2 np-border-dark'>
                    <div className='np-w-full np-flex np-items-center np-justify-between'>
                        <div className='np-text-sm np-text-dark np-font-sans '>
                            Min
                        </div>
                        <input
                            className='np-h-8 np-w-36 np-ml-2 np-p-2 np-text-right np-text-xs np-font-sans np-rounded-sm np-border-2 np-border-dark no-focus'
                            defaultValue={min.toFixed(precision)}
                            {...register('min')}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div className='np-w-full np-mt-2 np-flex np-items-center np-justify-between'>
                        <div className='np-text-sm np-text-dark np-font-sans '>
                            Max
                        </div>
                        <input
                            className='np-h-8 np-w-36 np-ml-2 np-p-2 np-text-right np-text-xs np-font-sans np-rounded-sm np-border-2 np-border-dark no-focus'
                            defaultValue={max.toFixed(precision)}
                            {...register('max')}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div className='np-w-full np-mt-2 np-flex np-items-center np-justify-between'>
                        <div className='np-text-sm np-text-dark np-font-sans'>
                            Value
                        </div>
                        <input
                            className='np-h-8 np-w-36 np-ml-2 np-p-2 np-text-right np-text-xs np-font-sans np-rounded-sm np-border-2 np-border-dark no-focus'
                            defaultValue={initialValue}
                            {...register('value')}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
                <div className='np-w-full np-mt-0.5 np-p-2 np-flex np-flex-col np-rounded-md np-border-2 np-border-dark'>
                    <div className='np-w-full np-flex np-items-center np-justify-between'>
                        <div className='np-text-sm np-text-dark np-font-sans'>
                            Precision
                        </div>
                        <PrecisionInput precision={internalPrecision} onChange={setPrecision} />
                    </div>
                </div>
                <div className='np-w-full np-p-2 np-flex np-items-center np-justify-end'>
                    <div className="np-w-6 np-h-6 np-mr-2 np-flex np-items-center np-justify-center np-rounded-full np-border-2 np-border-dark hover:np-bg-grey hover:np-cursor-pointer" onClick={handleClose}>
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