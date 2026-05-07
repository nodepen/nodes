import { COLORS } from "@/constants"
import type { TemplateMatch } from "@/utils/templates/tryMatchTextSearch"
import { useMemo } from "react"

type Props = {
    match: TemplateMatch
}

export const ShortcutMatchInfo = ({ match }: Props) => {
    const emptyMessage = useMemo(() => {
        const messages = [
            'Limitless potential!',
            'Could be anything!',
            'How mysterious!',
            'What happens now?'
        ]

        const selectedMessage = messages[Math.floor(Math.random() * messages.length)]

        return selectedMessage
    }, [])


    const getInfo = () => {
        switch (match.type) {
            case 'number-slider': {
                const { min, max, precision } = match.config

                return (
                    <>
                        <div className="np-w-full np-mt-0.5 np-text-left np-text-sm np-font-panel np-text-dark np-whitespace-nowrap">
                            {'w/ domain'}
                        </div>
                        <div className="np-w-full np-mt-1 np-text-left np-text-xs np-font-panel np-text-dark np-whitespace-nowrap">
                            {`Min: ${min}`}
                        </div>
                        <div className="np-w-full np-mt-1 np-text-left np-text-xs np-font-panel np-text-dark np-whitespace-nowrap">
                            {`Max: ${max}`}
                        </div>
                        <div className="np-w-full np-mt-1 np-text-left np-text-xs np-font-panel np-text-dark np-whitespace-nowrap">
                            {`Value: ${match.value}`}
                        </div>
                    </>
                )
            }
            case 'panel': {
                const { textContent } = match.config

                const isEmpty = (textContent?.length ?? 0) === 0
                return (
                    <>
                        <div className="np-w-full np-mt-0.5 np-text-left np-text-sm np-font-panel np-text-dark np-whitespace-nowrap">
                            {isEmpty ? 'Empty panel' : 'w/ values'}
                        </div>
                        <div className="np-w-full np-mt-1 np-text-left np-text-xs np-font-panel np-text-dark np-whitespace-nowrap">
                            {isEmpty ? emptyMessage : textContent}
                        </div>
                    </>
                )
            }
            case 'addition':
            case 'subtraction':
            case 'multiplication':
            case 'division': {
                const { value } = match

                const messages = {
                    'addition': 'Add',
                    'subtraction': 'Subtract',
                    'multiplication': 'Multiply by',
                    'division': 'Divide by'
                }

                if (!value) {
                    return (
                        <>
                            <div className="np-w-full np-mt-0.5 np-text-left np-text-sm np-font-panel np-text-dark np-whitespace-nowrap">
                                {`${messages[match.type].replace(' by', '')} two numbers`}
                            </div>
                        </>
                    )
                }

                return (
                    <>
                        <div className="np-w-full np-mt-0.5 np-text-left np-text-sm np-font-panel np-text-dark np-whitespace-nowrap">
                            {`${messages[match.type]} ${value}`}
                        </div>
                    </>
                )
            }
            default: {
                return <></>
            }
        }
    }

    return (
        <div className="np-w-full np-h-24 np-flex np-items-stretch np-justify-start">
            <div className="np-w-8 np-min-w-8 np-h-full np-mr-0.5 np-flex np-flex-col np-items-center np-justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-4 np-mt-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" vectorEffect="non-scaling-stroke" />
                </svg>
            </div>
            <div className="np-grow np-h-full np-flex np-flex-col np-justify-start np-items-center">
                {getInfo()}
            </div>
        </div>
    )
}