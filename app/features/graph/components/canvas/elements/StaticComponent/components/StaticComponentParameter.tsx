import { Grasshopper } from 'glib'
import { useCameraZoomLevel } from '@/features/graph/store/camera/hooks'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { GripContainer, GripIcon, TooltipContainer, useGripContext } from '../../../common'
import { useLongHover } from 'hooks'
import { HoverTooltip } from '@/features/graph/components/overlay'
import { StaticComponentParameterDetails } from '../details'

type StaticComponentParameterProps = {
  template: Grasshopper.Parameter
  mode: 'input' | 'output'
}

const StaticComponentParameter = ({ template, mode }: StaticComponentParameterProps): React.ReactElement => {
  const { nickname } = template

  const { gripRef, register } = useGripContext()
  const zoomLevel = useCameraZoomLevel()

  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipPosition = useRef<[number, number]>([0, 0])

  const onLongHover = useCallback((e: PointerEvent) => {
    const { pageX, pageY } = e

    tooltipPosition.current = [pageX, pageY]
    setShowTooltip(true)
  }, [])

  const longHoverTarget = useLongHover(onLongHover)

  useEffect(() => {
    const offset: [number, number] = [mode === 'input' ? -2 : 2, 2]
    register(offset)
  }, [])

  const t = mode === 'input' ? 'translateX(-9px)' : 'translateX(9px)'

  return (
    <>
      <div
        className={`${
          mode === 'input' ? 'flex-row' : 'flex-row-reverse'
        } w-full h-full flex justify-start items-center`}
        ref={longHoverTarget}
      >
        <div style={{ transform: t }} ref={gripRef}>
          <GripIcon mode={mode} shadow={zoomLevel !== 'far'} />
        </div>
        <p
          className={`${zoomLevel === 'far' ? 'opacity-0' : 'opacity-100'} font-panel font-semibold select-none`}
          style={{ transform: 'translateY(1px)' }}
        >
          {nickname}
        </p>
      </div>
      {showTooltip ? (
        <HoverTooltip position={tooltipPosition.current} onClose={() => setShowTooltip(false)}>
          <TooltipContainer>
            <StaticComponentParameterDetails template={template} />
          </TooltipContainer>
        </HoverTooltip>
      ) : null}
    </>
  )
}

type StaticComponentParameterContainerProps = {
  elementId: string
  parameterId: string
  mode: 'input' | 'output'
  template: Grasshopper.Parameter
}

export const StaticComponentParameterContainer = ({
  elementId,
  parameterId,
  mode,
  template,
}: StaticComponentParameterContainerProps): React.ReactElement => {
  const border = mode === 'input' ? 'border-l-2 rounded-tr-md rounded-br-md' : 'border-r-2 rounded-tl-md rounded-bl-md'
  const p = mode === 'input' ? 'pr-4' : 'pl-4'

  return (
    <div
      className={`${p} ${border} flex-grow pt-2 pb-2 flex flex-row justify-start items-center border-dark transition-colors duration-75 overflow-visible cursor-default`}
    >
      <GripContainer
        elementId={elementId}
        parameterId={parameterId}
        mode={mode}
        onClick={() => {
          console.log('Static component parameter clicked!')
        }}
      >
        <StaticComponentParameter template={template} mode={mode} />
      </GripContainer>
    </div>
  )
}
