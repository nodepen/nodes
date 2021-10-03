import { Grasshopper } from 'glib'
import { useCameraZoomLevel } from '@/features/graph/store/camera/hooks'
import React, { useEffect } from 'react'
import { GripContainer, GripIcon, useGripContext } from '../../../common'
import { useSessionManager } from '@/features/common/context/session'

type StaticComponentParameterProps = {
  template: Grasshopper.Parameter
  mode: 'input' | 'output'
}

const StaticComponentParameter = ({ template, mode }: StaticComponentParameterProps): React.ReactElement => {
  const { nickname } = template

  const { gripRef, register } = useGripContext()
  const zoomLevel = useCameraZoomLevel()

  useEffect(() => {
    const offset: [number, number] = [mode === 'input' ? -14 : 14, 2]
    register(offset)
  }, [])

  const t = mode === 'input' ? 'translateX(-9px)' : 'translateX(9px)'

  return (
    <div
      className={`${mode === 'input' ? 'flex-row' : 'flex-row-reverse'} w-full h-full flex justify-start items-center`}
      ref={gripRef}
    >
      <div style={{ transform: t }}>
        <GripIcon mode={mode} shadow={zoomLevel !== 'far'} />
      </div>
      <p className="font-panel font-semibold select-none" style={{ transform: 'translateY(1px)' }}>
        {nickname}
      </p>
    </div>
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
  const { device } = useSessionManager()

  const border = mode === 'input' ? 'border-l-2 rounded-tr-md rounded-br-md' : 'border-r-2 rounded-tl-md rounded-bl-md'
  const p = mode === 'input' ? 'pr-4' : 'pl-4'

  return (
    <div
      className={`${p} ${border} ${
        device.breakpoint === 'sm' ? '' : 'hover:bg-gray-300'
      } flex-grow pt-2 pb-2 flex flex-row justify-start items-center border-dark transition-colors duration-75 overflow-visible cursor-default`}
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
