import { DataTreeTable } from '@/components/trees/DataTreeTable'
import { DIMENSIONS } from '@/constants'
import { usePortValues } from '@/hooks'
import type * as NodePen from '@/types'
import { Dialog } from '@/views/components'
import React, { useCallback, useRef, useState } from 'react'

const {
    NODE_INTERNAL_PADDING
} = DIMENSIONS

type PanelDataProps = {
    node: NodePen.DocumentNode
    onScrollStart: () => void
    onScrollEnd: () => void
}

export const PanelDataTree = ({ node, onScrollStart, onScrollEnd }: PanelDataProps) => {
    const { dimensions, position } = node

    const containerRef = useRef<HTMLDivElement>(null)

    const values = usePortValues(node.instanceId, 'output')

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const x = position.x + NODE_INTERNAL_PADDING * 2
    const y = position.y
    const width = dimensions.width - NODE_INTERNAL_PADDING * 4
    const height = dimensions.height

    // We must set `data-scrolling` on a div above `useDraggableNode` `g` element
    const isScrolling = useRef(false)

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        if (!isScrolling.current) {
            onScrollStart()
            isScrolling.current = true
        }
    }, [])

    const handleScrollEnd = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        onScrollEnd()
        isScrolling.current = false
    }, [])

    return (
        <>
            <foreignObject
                x={x}
                y={y}
                width={width}
                height={height}
            >
                <div data-scrollable ref={containerRef} className='np-w-full np-h-full np-overflow-y-auto'
                    onDoubleClick={(e) => {
                        e.stopPropagation()
                        setIsDialogOpen(true)
                    }}
                    onScroll={handleScroll}
                    onScrollEnd={handleScrollEnd}
                >
                    {values
                        ? <DataTreeTable data={values} />
                        : null
                    }
                </div>
            </foreignObject>
            {isDialogOpen
                ? <Dialog onClose={() => setIsDialogOpen(false)}>
                    <div className='np-p-4 np-w-96 np-h-48'>
                        {values
                            ? <DataTreeTable data={values} />
                            : null
                        }
                    </div>
                </Dialog>
                : null
            }
        </>
    )


}