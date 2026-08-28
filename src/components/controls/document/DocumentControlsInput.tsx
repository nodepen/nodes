import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type * as NodePen from '@/types'
import { COLORS } from '@/constants'
import { useDispatch, useStore } from '@/store'
import { usePortLabel } from '@/hooks/usePortLabel'
import { usePortTemplate } from '@/hooks/usePortTemplate'
import { getDataTreeValueString, tryCreateSingleValue, tryGetSingleValue } from '@/utils/data-trees'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import { expireSolution } from '@/store/utils'
import { saveDocument } from '@/store/utils/saveDocument'
import { PortTypeIcon } from '@/components/icons'
import { DocumentControlsNumberSlider } from './DocumentControlsNumberSlider'
import { DocumentControlsBoolean } from './DocumentControlsBoolean'
import { DocumentControlsGeometry } from './DocumentControlsGeometry'
import { DocumentControlsValueList } from './DocumentControlsValueList'
import { DocumentControlsBooleanToggle } from './DocumentControlsBooleanToggle'
import { useIsEditable } from '@/hooks/useIsEditable'
import { useFlag } from '@/hooks/useFlag'

type DocumentControlsInputProps = {
    nodeInstanceId: string
    portInstanceId: string
}

export const DocumentControlsInput = ({ nodeInstanceId, portInstanceId }: DocumentControlsInputProps) => {
    const { apply, moveControl } = useDispatch()

    const isEditable = useIsEditable()

    const isControlsEditable = useFlag('isControlsEditable')

    const hideScript = useFlag('hideScript')

    const { currentLabel } = usePortLabel(nodeInstanceId, portInstanceId)
    const portTemplate = usePortTemplate(nodeInstanceId, portInstanceId)

    const currentValue = useStore((state) => tryGetSingleValue(state.document.nodes[nodeInstanceId]?.values[portInstanceId]))
    const valueType = (currentValue?.type ?? portTemplate?.typeName ?? 'string') as NodePen.DataTreeValueType

    const numberSliderConfig = useStore((state) => {
        const node = state.document.nodes[nodeInstanceId]
        const template = node ? state.templates[node.templateId] : undefined

        if (!node || !template || getNodeTypeForTemplate(template) !== 'number-slider') {
            return null
        }

        return node.nodeConfiguration as NodePen.NumberSliderConfig
    })

    const valueListConfig = useStore((state) => {
        const node = state.document.nodes[nodeInstanceId]
        const template = node ? state.templates[node.templateId] : undefined

        if (!node || !template || getNodeTypeForTemplate(template) !== 'value-list') {
            return null
        }

        return node.nodeConfiguration as NodePen.ValueListConfig
    })

    const [internalLabel, setInternalLabel] = useState(currentLabel)
    useEffect(() => {
        setInternalLabel(currentLabel)
    }, [currentLabel])

    const [internalValue, setInternalValue] = useState(getDataTreeValueString(currentValue))
    useEffect(() => {
        setInternalValue(getDataTreeValueString(currentValue))
    }, [currentValue])

    const commitValue = useCallback((next: string) => {
        const dataTree = tryCreateSingleValue(next, valueType)

        if (!dataTree) {
            // Invalid for this type, snap back to the last known-good value.
            setInternalValue(getDataTreeValueString(currentValue))
            return
        }

        apply((state) => {
            const node = state.document.nodes[nodeInstanceId]

            if (!node) {
                return
            }

            node.values[portInstanceId] = dataTree
            expireSolution(state)
        })
    }, [apply, currentValue, nodeInstanceId, portInstanceId, valueType])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInternalValue(e.currentTarget.value)
    }, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()

        if (e.key.toLowerCase() === 'enter') {
            e.currentTarget.blur()
        }
    }, [])

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.select()
    }, [])

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        commitValue(e.currentTarget.value)
    }, [commitValue])

    const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInternalLabel(e.currentTarget.value)
    }, [])

    const handleLabelKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()

        if (e.key.toLowerCase() === 'enter') {
            e.currentTarget.blur()
        }
    }, [])

    const handleLabelFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.select()
    }, [])

    const handleLabelBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const nextLabel = e.currentTarget.value

        setInternalLabel(nextLabel)
        e.currentTarget.scroll(0, 0)

        if (nextLabel === currentLabel) {
            return
        }

        apply((state) => {
            const node = state.document.nodes[nodeInstanceId]

            if (!node) {
                return
            }

            node.portConfigurations[portInstanceId] ??= {
                label: null,
                flags: []
            }
            node.portConfigurations[portInstanceId].label = nextLabel
            saveDocument(state)
        })
    }, [apply, currentLabel, nodeInstanceId, portInstanceId])

    const handleLocateSource = useCallback(() => {
        apply((state) => {
            const node = state.document.nodes[nodeInstanceId]

            if (!node) {
                return
            }

            const { position, dimensions } = node

            // TODO: Slick "pan to position"
            state.camera.position = {
                x: position.x + dimensions.width / 2,
                y: -(position.y + dimensions.width / 2)
            }
            state.registry.selection.nodes = [nodeInstanceId]
        })
    }, [])

    const handleMoveUp = useCallback(() => {
        moveControl('input', nodeInstanceId, portInstanceId, -1)
    }, [moveControl, nodeInstanceId, portInstanceId])

    const handleMoveDown = useCallback(() => {
        moveControl('input', nodeInstanceId, portInstanceId, 1)
    }, [moveControl, nodeInstanceId, portInstanceId])

    const nodeType = useStore((state) => {
        const node = state.document.nodes[nodeInstanceId]
        return node ? getNodeTypeForTemplate(state.templates[node.templateId]) : 'unknown'
    })

    const getInputRow = () => {
        switch (nodeType) {
            case 'number-slider': {
                if (!numberSliderConfig) {
                    console.log(`🐍 Tried to render input for number slider with no config!`)
                    return null
                }
                return <DocumentControlsNumberSlider nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} config={numberSliderConfig} isDisabled={!isControlsEditable} />
            }
            case 'value-list': {
                if (!valueListConfig) {
                    console.log(`🐍 Tried to render input for value list with no config!`)
                    return null
                }
                return <DocumentControlsValueList nodeInstanceId={nodeInstanceId} config={valueListConfig} isDisabled={!isControlsEditable} />
            }
            case 'boolean-toggle': {
                return <DocumentControlsBooleanToggle nodeInstanceId={nodeInstanceId} isDisabled={!isControlsEditable} />
            }
            case 'generic-node':
            case 'generic-parameter': {
                switch (valueType) {
                    case 'boolean': {
                        return <DocumentControlsBoolean nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} isDisabled={!isControlsEditable} />
                    }
                    case 'number':
                    case 'integer':
                    case 'text':
                    case 'string': {
                        return <input
                            className={`${isControlsEditable ? 'hover:np-bg-grey np-text-dark' : 'np-text-grey-3'} np-w-full np-h-5 np-pl-1 np-rounded-sm np-text-xs np-font-panel placeholder:np-text-grey-3 focus:np-outline-none -np-translate-y-1`}
                            value={internalValue}
                            placeholder={`${isControlsEditable ? 'Set' : 'Unset'} ${valueType} value`}
                            disabled={!isControlsEditable}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    }
                    case 'point':
                    case 'circle':
                    case 'curve':
                    case 'line':
                    case 'mesh':
                    case 'surface':
                    case 'extrusion':
                    case 'brep':
                    case 'box':
                        return <DocumentControlsGeometry nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} valueType={valueType} isDisabled={!isControlsEditable} />
                    case 'reference':
                    default:
                        return null
                }
            }
            default:
                return null
        }
    }

    return (
        <div className="np-w-full np-flex np-flex-col np-pl-0.5 np-pr-0.5">
            <div className="np-w-full np-pl-3 np-flex np-items-center np-justify-start">
                <PortTypeIcon r={16} typeName={valueType} />
                <input
                    className={`${isEditable ? 'hover:np-bg-grey ' : ''} np-ml-1 np-min-w-0 np-flex-grow np-h-5 np-pl-1 np-pt-0.5 np-rounded-sm np-text-xs np-text-dark np-font-panel focus:np-outline-none`}
                    value={internalLabel}
                    disabled={!isEditable}
                    onChange={handleLabelChange}
                    onKeyDown={handleLabelKeyDown}
                    onFocus={handleLabelFocus}
                    onBlur={handleLabelBlur}
                />
                <div className="np-mr-0.5 np-pr-1 np-flex np-items-center">
                    {!hideScript ? (<div className="np-w-5 np-h-5 np-flex np-justify-center np-items-center np-rounded-full hover:np-bg-grey hover:np-cursor-pointer" onClick={handleLocateSource}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-3">
                            <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                        </svg>
                    </div>) : null}
                    {isEditable ? (<>
                        <div className="np-w-5 np-h-5 np-flex np-justify-center np-items-center np-rounded-full hover:np-bg-grey hover:np-cursor-pointer" onClick={handleMoveUp}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" vectorEffect="non-scaling-stroke" />
                            </svg>
                        </div>
                        <div className="np-w-5 np-h-5 np-flex np-justify-center np-items-center np-rounded-full hover:np-bg-grey hover:np-cursor-pointer" onClick={handleMoveDown}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" vectorEffect="non-scaling-stroke" />
                            </svg>
                        </div>
                    </>) : null}
                </div>
            </div>
            <div className='np-w-full np-h-5 np-mb-1.5 np-pl-8'>
                {getInputRow()}
            </div>
        </div>
    )
}
