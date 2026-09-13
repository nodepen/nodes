import React, { useEffect, useRef, useState } from 'react'
import { useStore } from '$'
import { CAMERA, COLORS } from '@/constants'
import { useCameraProps } from '../../hooks'

type GridDetailLevel = 'low' | 'medium' | 'high'

const GRID_PATTERN_ID = 'np-grid-pattern'

const GRID_LINE_WIDTH = 1.1

const CanvasGridUnderlay = (): React.ReactElement | null => {
    const cameraProps = useCameraProps()

    const zoom = useStore((state) => state.camera.zoom)

    const [detailLevel, setDetailLevel] = useState<GridDetailLevel>('medium')

    const previousDetailLevel = useRef<GridDetailLevel>(detailLevel)
    useEffect(
        () =>
            useStore.subscribe((state) => {
                const zoom = state.camera.zoom

                let nextDetailLevel: GridDetailLevel = 'low'

                if (zoom > CAMERA.ZOOM_BREAKPOINT_NEAR) {
                    nextDetailLevel = 'high'
                } else if (zoom > CAMERA.ZOOM_BREAKPOINT_FAR) {
                    nextDetailLevel = 'medium'
                } else {
                    nextDetailLevel = 'low'
                }

                if (previousDetailLevel.current !== nextDetailLevel) {
                    setDetailLevel(nextDetailLevel)
                }

                previousDetailLevel.current = nextDetailLevel
            }),
        []
    )

    const getGridSpacing = (detail: GridDetailLevel): number => {
        switch (detail) {
            case 'low': {
                return 200
            }
            case 'medium': {
                return 100
            }
            case 'high': {
                return 50
            }
        }
    }

    const getGridCount = (detail: GridDetailLevel): number => {
        switch (detail) {
            case 'low': {
                return 50
            }
            case 'medium': {
                return 100
            }
            case 'high': {
                return 200
            }
        }
    }

    const spacing = getGridSpacing(detailLevel)
    const extent = (spacing * getGridCount(detailLevel)) + GRID_LINE_WIDTH

    return (
        <svg {...cameraProps} className="np-overflow-hidden np-pointer-events-none np-bg-pale np-rounded-md">
            <defs>
                <pattern id={GRID_PATTERN_ID} width={spacing} height={spacing} patternUnits="userSpaceOnUse">
                    <path
                        d={`M ${spacing} 0 L 0 0 0 ${spacing}`}
                        fill="none"
                        stroke={COLORS.GREEN}
                        strokeWidth={GRID_LINE_WIDTH / zoom}
                    />
                </pattern>
            </defs>
            <rect x={0} y={0} width={extent} height={extent} fill={`url(#${GRID_PATTERN_ID})`} />
        </svg>
    )
}

export default React.memo(CanvasGridUnderlay)
