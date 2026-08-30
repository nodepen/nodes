import React, { useCallback, useEffect, useRef, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { COLORS } from '@/constants'
import { useDispatch, useStore } from '@/store'
import { useIsEditable } from '@/hooks/useIsEditable'
import { saveDocument } from '@/store/utils/saveDocument'

export const DocumentSelection = () => {
    const { apply } = useDispatch()

    const isEditable = useIsEditable()

    const selectedGroupIds = useStore((state) => state.registry.selection.groups, shallow)

    // Latch onto the last non-empty selection. Clicking the canvas to clear the
    // selection fires a store update (and re-render) before a focused field's
    // blur is processed -- if we derived `groupId` straight from the live
    // selection, that re-render would unmount the field (or swap its handlers
    // out from under it) before blur could commit the edit. Holding onto the
    // last known id keeps the field mounted through that transition; it's fine
    // for the resulting blur to write to a group that's no longer selected.
    const [groupIds, setGroupIds] = useState(selectedGroupIds)
    useEffect(() => {
        if (selectedGroupIds.length > 0) {
            setGroupIds(selectedGroupIds)
        }
    }, [selectedGroupIds])

    const groupId = groupIds[0] ?? null

    const groupLabel = useStore((state) => (groupId ? state.document.groups[groupId]?.label : undefined) ?? '')
    const groupDescription = useStore((state) => (groupId ? state.document.groups[groupId]?.description : undefined) ?? '')

    const [internalLabel, setInternalLabel] = useState(groupLabel)
    useEffect(() => {
        setInternalLabel(groupLabel)
    }, [groupId, groupLabel])

    const [internalDescription, setInternalDescription] = useState(groupDescription)
    useEffect(() => {
        setInternalDescription(groupDescription)
    }, [groupId, groupDescription])

    // Tracks whether the label actually changed during the current focus, so
    // blur only saves for a real edit -- see handleLabelBlur. Immediate
    // writes below keep this in sync with the store, so comparing against the
    // store's value at blur time (which by then always matches) can't tell.
    const labelChangedRef = useRef(false)

    // Handlers take the source group's id explicitly, bound at the callsite to
    // whichever id was current when the field was rendered -- rather than
    // reading `groupId` fresh, which may have already moved on by the time
    // the handler runs.
    const handleLabelChange = useCallback((id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const nextLabel = e.currentTarget.value

        setInternalLabel(nextLabel)
        labelChangedRef.current = true

        // The canvas label (see Group.tsx) reads straight from the document,
        // so it needs the new name as the user types -- persisting it is a
        // separate step, done on blur.
        apply((state) => {
            const group = state.document.groups[id]

            if (!group) {
                console.log(`🐍 Could not find group ${id} to rename`)
                return
            }

            group.label = nextLabel
        })
    }, [apply])

    const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInternalDescription(e.currentTarget.value)
    }, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
    }, [])

    const handleLabelKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key.toLowerCase() === 'enter') {
            e.currentTarget.blur()
        }
    }, [])

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.currentTarget.select()
    }, [])

    const handleLabelFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        labelChangedRef.current = false
        e.currentTarget.select()
    }, [])

    // The label itself was already written to the document by
    // handleLabelChange as the user typed -- blur only needs to persist it,
    // and only if this focus actually touched the value.
    const handleLabelBlur = useCallback((id: string, e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.scroll(0, 0)

        if (!labelChangedRef.current) {
            return
        }

        apply((state) => {
            const group = state.document.groups[id]

            if (!group) {
                console.log(`🐍 Could not find group ${id} to rename`)
                return
            }

            saveDocument(state)
        })
    }, [apply])

    const handleDescriptionBlur = useCallback((id: string, e: React.FocusEvent<HTMLTextAreaElement>) => {
        const nextDescription = e.currentTarget.value

        apply((state) => {
            const group = state.document.groups[id]

            if (!group) {
                console.log(`🐍 Could not find group ${id} to describe`)
                return
            }

            if (group.description === nextDescription) {
                return
            }

            group.description = nextDescription
            saveDocument(state)
        })
    }, [apply])

    if (!groupId) {
        return null
    }

    return (
        <div className="np-w-full np-h-full np-flex np-flex-col np-justify-start np-items-center">
            <div className="np-w-full np-pl-0.5 np-h-8 np-flex np-items-center np-justify-start">
                <div className='np-w-8 np-h-8 np-ml-1 np-p-0.5'>
                    <div className='np-w-full np-h-full np-rounded-full np-flex np-items-center np-justify-center np-border-2 np-border-dark'>
                        <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-4'>
                            <path d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                        </svg>
                    </div>
                </div>
                <p className="np-ml-2 np-flex-grow np-text-[13px] np-text-dark np-font-panel np-leading-tight np-translate-y-px">
                    Group
                </p>
            </div>
            <div className="np-w-full np-grow np-flex np-flex-col np-items-center np-pt-1 np-pb-2 np-pl-2 np-pr-2">
                <input
                    className={`${isEditable ? 'hover:np-bg-grey' : ''} np-w-full np-h-6 np-mb-1 np-pl-1.5 np-pt-0.5 np-rounded-sm np-text-sm np-text-dark np-font-panel focus:np-outline-none`}
                    value={internalLabel}
                    placeholder="Name"
                    disabled={!isEditable}
                    onChange={(e) => handleLabelChange(groupId, e)}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleLabelKeyUp}
                    onFocus={handleLabelFocus}
                    onBlur={(e) => handleLabelBlur(groupId, e)}
                />
                <textarea
                    className={`${isEditable ? 'hover:np-bg-grey' : ''} np-w-full np-grow np-pl-1.5 np-pt-1 np-rounded-sm np-text-xs np-text-dark np-font-panel focus:np-outline-none`}
                    style={{ resize: 'none' }}
                    value={internalDescription}
                    placeholder="Description"
                    disabled={!isEditable}
                    onChange={handleDescriptionChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={(e) => handleDescriptionBlur(groupId, e)}
                />
            </div>
        </div>
    )
}
