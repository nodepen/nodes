import React, { useEffect, useCallback } from 'react'
import { usePseudoShadow } from '@/views/common/pseudo-shadow'
import { COLORS, KEYS } from '@/constants'
import { useDocumentProgress, useModelProgress } from './hooks'
import { ProgressBar } from './components'
import { useDispatch, useStore } from '@/store'
import { usePageSpaceToOverlaySpace, useReducedMotion } from '@/hooks'

const { PROGRESS_BAR_HOVER, PROGRESS_BAR_VIEW_DOCUMENT, PROGRESS_BAR_VIEW_MODEL } = KEYS.TOOLTIPS

export const SolutionStatusBar = (): React.ReactElement => {
  const { apply } = useDispatch()

  const prefersReducedMotion = useReducedMotion()

  const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

  const shadowTarget = usePseudoShadow(undefined, false)

  const documentProgressStatus = useDocumentProgress()
  const modelProgressStatus = useModelProgress()

  const { progress: documentProgress } = documentProgressStatus
  const { progress: solutionProgress } = modelProgressStatus
  const progress = documentProgress / 2 + solutionProgress / 2

  const getSolutionResultStatusIcon = () => {
    // TODO: Surface and check for "error" states here
    return (
      <svg
        style={{ width: 20, height: 20 }}
        fill="none"
        stroke={COLORS.DARK}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )
  }

  const handleMouseEnter = useCallback(() => {
    const containerRef = shadowTarget.current

    if (!containerRef) {
      console.log('🐍 Attempted to create progress bar tooltips but could not find container element!')
      return
    }

    const { left, top } = containerRef.getBoundingClientRect()
    const [overlayX, overlayY] = pageSpaceToOverlaySpace(left, top)

    apply((state) => {
      state.registry.tooltips[PROGRESS_BAR_HOVER] = {
        context: {
          type: 'progress-bar',
          data: {
            [PROGRESS_BAR_VIEW_DOCUMENT]: {
              order: 0,
              viewKey: 'document',
              statusLevel: documentProgressStatus.statusLevel,
              statusMessage: documentProgressStatus.statusMessage,
            },
            [PROGRESS_BAR_VIEW_MODEL]: {
              order: 1,
              viewKey: 'model',
              statusLevel: modelProgressStatus.statusLevel,
              statusMessage: modelProgressStatus.statusMessage,
            },
          },
        },
        configuration: {
          position: {
            x: overlayX,
            y: overlayY,
          },
          isSticky: true,
        },
      }
    })
  }, [documentProgressStatus, modelProgressStatus])

  const handleMouseLeave = useCallback(() => {
    apply((state) => {
      delete state.registry.tooltips[PROGRESS_BAR_HOVER]
    })
  }, [])

  useEffect(() => {
    const currentTooltip = useStore.getState().registry.tooltips[PROGRESS_BAR_HOVER]

    if (!currentTooltip) {
      // Tooltip does not exist, do no work
      return
    }

    apply((state) => {
      const tooltip = state.registry.tooltips[PROGRESS_BAR_HOVER]

      if (tooltip.context.type !== 'progress-bar') {
        return
      }

      tooltip.context.data = {
        [PROGRESS_BAR_VIEW_DOCUMENT]: {
          order: 0,
          viewKey: 'document',
          statusLevel: documentProgressStatus.statusLevel,
          statusMessage: documentProgressStatus.statusMessage,
        },
        [PROGRESS_BAR_VIEW_MODEL]: {
          order: 1,
          viewKey: 'model',
          statusLevel: modelProgressStatus.statusLevel,
          statusMessage: modelProgressStatus.statusMessage,
        },
      }
    })
  }, [documentProgressStatus, modelProgressStatus])

  return (
    <div
      className="np-flex-grow np-h-8 np-pointer-events-auto"
      ref={shadowTarget}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="np-w-full np-h-full np-flex np-justify-start np-items-center np-rounded-md np-bg-light np-shadow-main">
        <div className="np-w-8 np-h-8 np-flex np-items-center np-justify-center">
          <div className="np-relative np-w-full np-h-full">
            <div
              id="np-solution-status-icon"
              className={`${
                progress === 1 ? 'np-opacity-100' : 'np-opacity-0'
              } np-absolute np-l-0 np-t-0 np-w-8 np-h-8 np-flex np-items-center np-justify-center`}
            >
              {getSolutionResultStatusIcon()}
            </div>
            <div
              id="np-solution-loading-icon"
              className={`${
                progress === 1 ? 'np-opacity-0' : 'np-opacity-100'
              } np-absolute np-l-0 np-t-0 np-w-8 np-h-8 np-flex np-items-center np-justify-center`}
            >
              <svg
                aria-hidden="true"
                className={prefersReducedMotion ? '' : 'np-animate-march-rotate'}
                style={{ width: 20, height: 20 }}
                fill="none"
                stroke={COLORS.DARK}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="np-h-4 np-flex-grow np-pr-2 np-flex np-items-center np-justify-start">
          <ProgressBar progress={progress} />
        </div>
      </div>
    </div>
  )
}
