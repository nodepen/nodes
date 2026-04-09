import { COLORS } from "@/constants"
import { useDocumentRef, useImperativeEvent } from "@/hooks"
import React, { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react"

type MenuInputProps = {
    initialValue?: string
    valueType: string
    onSubmit: (value: string) => void
}

const MenuInputComponent = ({ initialValue, valueType, onSubmit }: MenuInputProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null)

    const [isValid, setIsValid] = useState(true)

    const isInputValid = useCallback((val: string, valueType: string): boolean => {
        switch (valueType) {
            case 'text':
            case 'string': {
                return true
            }
            case 'boolean': {
                return ['true', 'false'].includes(val)
            }
            case 'number': {
                return /^[+-]?\d+(\.\d+)?$/.test(val)
            }
            case 'integer': {
                return /^[+-]?\d+$/.test(val)
            }
            default: {
                return false
            }
        }
    }, [])

    const focusSelf = useCallback(() => {
        const el = inputRef.current

        if (!el) {
            return
        }

        queueMicrotask(() => { el.focus() })
    }, [])

    useEffect(() => {
        const el = inputRef.current

        if (!el) {
            return
        }

        if (initialValue) {
            el.value = initialValue
        }

        focusSelf()
    }, [])

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const el = inputRef.current

        if (!el) {
            return
        }

        if (!isInputValid(el.value, valueType)) {
            return
        }

        onSubmit(el.value)
    }, [isInputValid])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        const val = e.target.value
        setIsValid(isInputValid(val, valueType))
    }, [isInputValid])

    return (
        <div className="np-w-full np-max-w-full np-h-8 np-pl-[6px] np-flex np-items-center np-justify-between">
            <form onSubmit={handleSubmit}>
                <input ref={inputRef} onChange={handleChange} className={`${isValid ? 'np-text-dark' : 'np-text-error'} np-h-full np-w-32 np-font-sans np-font-medium np-text-sm focus:np-outline-none`} placeholder={`Set ${valueType}...`} />
            </form>
            <button className="np-h-full np-min-w-8 np-rounded-sm hover:np-bg-grey np-flex np-flex-col np-items-center np-justify-center" onClick={handleSubmit}>
                <svg className="np-w-5 np-h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} vectorEffect="non-scaling-stroke">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </button>
        </div>
    )
}

export const MenuInput = React.memo(MenuInputComponent)