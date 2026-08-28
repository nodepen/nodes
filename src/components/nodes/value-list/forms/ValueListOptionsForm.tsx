import React, { useCallback, useState } from 'react'
import type * as NodePen from '@/types'
import { useDispatch } from '@/store'
import { expireSolution } from '@/store/utils'
import { COLORS } from '@/constants'
import { newGuid } from '@/utils/common'

type Row = {
    key: string
    name: string
    wasSelected: boolean
}

type ValueListOptionsFormProps = {
    node: NodePen.DocumentNode
    config: NodePen.ValueListConfig
    onClose: () => void
}

export const ValueListOptionsForm = ({ node, config, onClose }: ValueListOptionsFormProps) => {
    const { apply } = useDispatch()

    const [rows, setRows] = useState<Row[]>(() =>
        config.items.map((item) => ({
            key: newGuid(),
            name: item.name,
            wasSelected: item.isSelected,
        }))
    )

    const handleChangeName = useCallback((key: string, name: string) => {
        setRows((current) => current.map((row) => (row.key === key ? { ...row, name } : row)))
    }, [])

    const handleAddRow = useCallback(() => {
        setRows((current) => [...current, { key: newGuid(), name: '', wasSelected: false }])
    }, [])

    const handleDeleteRow = useCallback((key: string) => {
        setRows((current) => current.filter((row) => row.key !== key))
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

        const trimmedRows = rows
            .map((row) => ({ ...row, name: row.name.trim() }))
            .filter((row) => row.name.length > 0)

        // Keep the same item selected if it survived edits, otherwise fall back to the first item
        const selectedIndex = Math.max(0, trimmedRows.findIndex((row) => row.wasSelected))

        apply((state) => {
            const nextConfig = state.document.nodes[node.instanceId]?.nodeConfiguration as NodePen.ValueListConfig | undefined

            if (!nextConfig) {
                console.log(`🐍 Could not find config for value list ${node.instanceId}`)
                return
            }

            nextConfig.items = trimmedRows.map((row, i) => ({
                name: row.name,
                expression: `"${row.name.replace(/"/g, '\\"')}"`,
                isSelected: i === selectedIndex,
            }))

            expireSolution(state)
        })

        onClose()
    }, [rows, node.instanceId, onClose])

    return (
        <div className="np-w-64 np-p-0.5">
            <form onSubmit={handleSubmit}>
                <div className="np-w-full np-p-2 np-flex np-flex-col np-rounded-md np-border-2 np-border-dark">
                    <div className="np-w-full np-max-h-64 np-flex np-flex-col np-overflow-y-auto">
                        {rows.map((row) => (
                            <div key={row.key} className="np-w-full np-flex np-items-center np-mb-2 last:np-mb-0">
                                <input
                                    className="np-h-8 np-w-full np-p-2 np-text-xs np-font-sans np-rounded-sm np-border-2 np-border-dark no-focus"
                                    value={row.name}
                                    placeholder="Option name..."
                                    onChange={(e) => handleChangeName(row.key, e.currentTarget.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <div
                                    className="np-w-8 np-h-8 np-ml-1 np-min-w-8 np-flex np-items-center np-justify-center np-rounded-sm hover:np-bg-grey hover:np-cursor-pointer"
                                    onClick={() => handleDeleteRow(row.key)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" vectorEffect="non-scaling-stroke" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div
                        className="np-w-full np-h-8 np-mt-2 np-p-0.5 np-flex np-items-center np-justify-center np-rounded-sm np-border-2 np-border-dashed np-border-dark np-group"
                        onClick={handleAddRow}
                    >
                        <div className='np-w-full np-h-full np-rounded-sm np-flex np-items-center np-justify-center group-hover:np-bg-grey group-hover:np-cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" vectorEffect="non-scaling-stroke" />
                            </svg>
                        </div>
                    </div>
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
            </form >
        </div >
    )
}
