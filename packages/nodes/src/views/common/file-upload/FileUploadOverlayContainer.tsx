import React, { useCallback } from 'react'
import { useCallbacks, useDispatch, useStore } from '$'
import { Layer } from '../layer'
import { COLORS } from '@/constants'
import { useReducedMotion } from '@/hooks'

const FileUploadOverlayContainer = (): React.ReactElement => {
  const { isActive } = useStore((state) => state.layout.fileUpload)

  const { apply } = useDispatch()
  const { onFileUpload } = useCallbacks()

  const prefersReducedMotion = useReducedMotion()

  const strokeWidth = isActive ? 160 : 0
  const r = isActive ? 20 : 100

  const handleDragLeave = useCallback((_e: React.DragEvent<SVGSVGElement>) => {
    apply((state) => {
      state.layout.fileUpload.isActive = false
    })
  }, [])

  const handleDragDrop = useCallback(
    (e: React.DragEvent<SVGSVGElement>) => {
      e.preventDefault()
      e.stopPropagation()

      const file = e.dataTransfer.files.item(0)

      apply((state) => {
        state.layout.fileUpload.activeFile = file
        state.layout.fileUpload.uploadStatus = 'pending'

        if (!file) {
          console.log('🐍 No files present in drop event!')
          state.layout.fileUpload.isActive = false
        }

        if (!onFileUpload) {
          console.log('🐍 No [onFileUpload]  callback found.')
          state.layout.fileUpload.isActive = false
          return
        }

        const handleFileUpload = async (): Promise<void> => {
          await onFileUpload(state)
        }

        handleFileUpload()
          .then(() => {
            // Successfully performed file upload
            apply((state) => {
              state.layout.fileUpload.isActive = false
              state.layout.fileUpload.uploadStatus = 'success'
            })
          })
          .catch((e) => {
            // Failed to perform upload
            console.error(e)
            apply((state) => {
              state.layout.fileUpload.uploadStatus = 'failure'
            })
          })
      })
    },
    [onFileUpload]
  )

  return (
    <>
      <Layer id="np-file-upload-overlay-content" z={96}>
        <div
          className="np-w-full np-h-full np-flex np-items-center np-justify-center"
          style={{
            transform: `translateY(${isActive ? '33%' : '100%'})`,
            transition: prefersReducedMotion ? '' : 'transform',
            transitionDuration: '300ms',
            transitionTimingFunction: 'ease-out',
          }}
        >
          <h3 className="np-font-panel np-font-medium np-text-darkgreen np-text-xl">Upload Script</h3>
        </div>
      </Layer>
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
              transition: prefersReducedMotion ? '' : 'stroke-width',
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
            style={{
              transition: prefersReducedMotion ? '' : 'stroke-width',
              transitionDuration: '300ms',
              transitionTimingFunction: 'ease-out',
            }}
          />
        </svg>
      </Layer>
      <Layer id="np-file-upload-overlay-shadow" z={30}>
        <svg className="np-w-full np-h-full" viewBox="0 0 100 100">
          <circle
            cx={49.5}
            cy={50.5}
            stroke={COLORS.SWAMPGREEN}
            strokeWidth={isActive ? 0.5 : 0}
            r={r - 0.25}
            fill="none"
            style={{
              transition: prefersReducedMotion ? '' : 'r',
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
