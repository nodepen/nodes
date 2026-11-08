import type * as NodePen from '@/types'
import React, { useCallback, useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useDispatch } from '@/store'
import { expireSolution } from '@/store/utils'
import { COLORS } from '@/constants'
import { useIsEditable } from '@/hooks/useIsEditable'

type ExpressionFormData = {
    expression: string
}

type ExpressionConfigFormProps = {
    node: NodePen.DocumentNode
    config: NodePen.ExpressionConfig
    onClose: () => void
}

export const ExpressionConfigForm = ({ node, config, onClose }: ExpressionConfigFormProps) => {
    const { apply } = useDispatch()

    const isEditable = useIsEditable()

    const { register, handleSubmit, setFocus } = useForm<ExpressionFormData>({
        defaultValues: {
            expression: config.expression,
        },
    })

    useEffect(() => {
        setFocus('expression')
    }, [])

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.select()
    }, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
    }, [])

    const onSubmit: SubmitHandler<ExpressionFormData> = (data) => {
        if (!isEditable) {
            return
        }

        apply((state) => {
            const currentNode = state.document.nodes[node.instanceId]

            if (!currentNode) {
                return
            }

            currentNode.nodeConfiguration = {
                ...(currentNode.nodeConfiguration as NodePen.ExpressionConfig),
                expression: data.expression,
            }

            expireSolution(state)
        })
        onClose()
    }

    return (
        <div className="np-w-80 np-p-0.5">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    className="np-h-10 np-w-full np-p-2 np-text-sm np-font-panel np-font-[800] np-text-dark np-rounded-md np-border-2 np-border-dark no-focus"
                    autoComplete="off"
                    spellCheck={false}
                    readOnly={!isEditable}
                    {...register('expression')}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                />
                <div className="np-w-full np-p-2 np-flex np-items-center np-justify-end">
                    <div className="np-w-6 np-h-6 np-mr-2 np-flex np-items-center np-justify-center np-rounded-full np-border-2 np-border-dark hover:np-bg-grey hover:np-cursor-pointer" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" vectorEffect="non-scaling-stroke" />
                        </svg>
                    </div>
                    <button
                        type="submit"
                        disabled={!isEditable}
                        className={`np-w-6 np-h-6 np-flex np-items-center np-justify-center np-rounded-full np-border-2 np-border-dark ${isEditable ? 'hover:np-bg-grey hover:np-cursor-pointer' : 'np-opacity-30 np-cursor-not-allowed'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" vectorEffect="non-scaling-stroke" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    )
}
