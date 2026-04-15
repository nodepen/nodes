import { useDispatch } from '@/store'
import type * as NodePen from '@/types'
import React, { useCallback } from 'react'

type DataTreeTable = {
    data: NodePen.DataTree
}

export const DataTreeTable = ({ data }: DataTreeTable) => {
    const { apply } = useDispatch()

    return (
        <div className='np-w-full np-grid np-grid-cols-[min-content_min-content_1fr] np-relative np-pointer-events-auto'
        >
            {data.branches.sort((a, b) => a.order - b.order).map((branch) => (
                <>
                    <div className='np-w-full np-sticky np-top-0 np-p-2 np-bg-light'>
                        {branch.path}
                    </div>
                    {branch.values.map((value, i) => (
                        <>
                            {i === 0
                                ? <></>
                                : <div />
                            }
                            <div className='np-p-2'>{value.order}</div>
                            <div className='np-w-full np-text-right np-p-2 np-whitespace-nowrap'>{value.description}</div>
                        </>
                    ))}
                </>
            ))}
        </div>
    )
}