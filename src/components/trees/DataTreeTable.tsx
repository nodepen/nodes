import { useDispatch } from '@/store'
import type * as NodePen from '@/types'
import React, { useCallback } from 'react'

type DataTreeTable = {
    nodeInstanceId: string
    portInstanceId: string
    data: NodePen.DataTree
}

export const DataTreeTable = ({ nodeInstanceId, portInstanceId, data }: DataTreeTable) => {
    const { apply } = useDispatch()

    const handlePointerEnter = useCallback((branchPath: string, branchEntryIndex: string) => {
        apply((state) => {
            state.registry.hover.nodeInstanceId = nodeInstanceId
            state.registry.hover.portInstanceId = portInstanceId
            state.registry.hover.branch = {
                path: branchPath,
                entryIndex: branchEntryIndex
            }
        })
    }, [])

    const handlePointerLeave = useCallback(() => {
        apply((state) => {
            state.registry.hover.branch = null
        })
    }, [])

    return (
        <div className='np-w-full np-grid np-grid-cols-[min-content_min-content_1fr] np-relative np-pointer-events-auto'
        >
            {data.branches.sort((a, b) => a.order - b.order).map((branch) => (
                <>
                    {branch.values.map((value, i) => (
                        <div className='np-grid np-grid-cols-subgrid np-col-span-full np-group' onPointerEnter={() => handlePointerEnter(branch.path, i.toString())} onPointerLeave={handlePointerLeave}>
                            {i === 0
                                ? <div className='np-w-full np-h-8 np-sticky np-top-0 np-mt-1 np-border-l-2 np-border-dark'>
                                    <div className='np-w-full np-mt-1 np-pl-2 np-pr-2 np-bg-light np-text-sm np-font-semibold np-font-panel np-text-dark'>
                                        {branch.path}
                                    </div>
                                </div>
                                : <div className='np-w-full np-h-8 np-border-l-2 np-border-dark' />
                            }
                            <div className='np-w-full np-h-full np-pt-1'>
                                <div className='np-w-full np-h-full np-pl-2 np-pr-2 np-flex np-items-center np-justify-start np-border-l-2 np-border-dark np-text-xs np-font-mono np-text-dark group-hover:np-bg-grey'>
                                    {value.order}
                                </div>
                            </div>
                            <div className='np-w-full np-h-full np-pt-1 np-overflow-visible'>
                                <div className='np-w-full np-h-full np-text-right np-pl-2 np-pr-2 np-flex np-items-center np-justify-end np-whitespace-nowrap np-border-r-2 np-border-dark np-text-sm np-font-panel np-text-dark group-hover:np-bg-grey'>
                                    {value.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            ))}
        </div>
    )
}