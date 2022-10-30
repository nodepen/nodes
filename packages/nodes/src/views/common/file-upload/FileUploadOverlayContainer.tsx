import React, { useCallback } from 'react'
import { useDispatch, useStore } from '$'
import { Layer } from '../layer'
import { COLORS } from '@/constants'

const FileUploadOverlayContainer = (): React.ReactElement => {
  const { isActive, activeFile, uploadStatus } = useStore((state) => state.layout.fileUpload)

  const { apply } = useDispatch()

  const strokeWidth = isActive ? 160 : 0
  const r = isActive ? 20 : 100

  const handleDragLeave = useCallback((e: React.DragEvent<SVGSVGElement>) => {
    apply((state) => {
      state.layout.fileUpload.isActive = false
    })
  }, [])

  const handleDragDrop = useCallback((e: React.DragEvent<SVGSVGElement>) => {
    e.preventDefault()
    e.stopPropagation()

    console.log(e)

    apply((state) => {
      state.layout.fileUpload.isActive = false
    })
  }, [])

  return (
    <>
      <Layer id="np-file-upload-overlay" z={95}>
        <svg
          className="np-w-full np-h-full"
          style={{ pointerEvents: isActive ? 'all' : 'none' }}
          viewBox="0 0 100 100"
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onDragLeave={handleDragLeave}
          onDrop={handleDragDrop}
        >
          <circle
            cx={49.5}
            cy={50.5}
            stroke={COLORS.SWAMPGREEN}
            strokeWidth={strokeWidth}
            r={100}
            fill="none"
            style={{
              transition: 'stroke-width',
              transitionDuration: '300ms',
              transitionTimingFunction: 'ease-out',
              opacity: '.3',
            }}
          />
          <circle
            cx={50}
            cy={50}
            stroke={COLORS.GREEN}
            strokeWidth={strokeWidth}
            r={100}
            fill="none"
            style={{ transition: 'stroke-width', transitionDuration: '300ms', transitionTimingFunction: 'ease-out' }}
          />
        </svg>
      </Layer>
      <Layer id="np-file-upload-overlay-shadow" z={30}>
        <svg className="np-w-full np-h-full" viewBox="0 0 100 100">
          <circle
            cx={49.5}
            cy={50.5}
            stroke={COLORS.SWAMPGREEN}
            strokeWidth={0.5}
            r={r - 0.25}
            fill="none"
            style={{
              transition: 'r',
              transitionDuration: '300ms',
              transitionTimingFunction: 'ease-out',
              opacity: '.3',
            }}
          />
        </svg>
      </Layer>
    </>
  )
}

export default React.memo(FileUploadOverlayContainer)
