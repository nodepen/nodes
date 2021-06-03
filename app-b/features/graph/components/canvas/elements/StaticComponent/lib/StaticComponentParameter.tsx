import { NodePen, Grasshopper } from 'glib'
import React, { useMemo } from 'react'
import { useSetCameraPosition } from 'features/graph/hooks'

type StaticComponentParameterProps = {
  parent: NodePen.Element<'static-component'>
  template: Grasshopper.Parameter
  mode: 'input' | 'output'
}

const StaticComponentParameter = ({ parent, template, mode }: StaticComponentParameterProps): React.ReactElement => {
  const { current, id } = parent
  const { name, nickname, type } = template

  const setCameraPosition = useSetCameraPosition()

  const grip = useMemo(() => {
    const tx = mode === 'input' ? 'translateX(-9px)' : 'translateX(9px)'
    const d = mode === 'input' ? 'M5,2 a1,1 0 0,0 0,8' : 'M5,10 a1,1 0 0,0 0,-8'

    return (
      <svg className="w-4 h-4 overflow-visible" viewBox="0 0 10 10" style={{ transform: tx }}>
        <path d={d} fill="#333" stroke="#333" strokeWidth="2px" vectorEffect="non-scaling-stroke" />
        <circle cx="5" cy="5" r="4" stroke="#333" strokeWidth="2px" vectorEffect="non-scaling-stroke" fill="#FFF" />
      </svg>
    )
  }, [mode])

  const body = useMemo(() => {
    return mode === 'input' ? (
      <>
        {grip}
        <p>{nickname}</p>
      </>
    ) : (
      <>
        <p>{nickname}</p>
        {grip}
      </>
    )
  }, [grip, mode, nickname])

  const border = mode === 'input' ? 'border-l-2 rounded-tr-md rounded-br-md' : 'border-r-2 rounded-tl-md rounded-bl-md'
  const p = mode === 'input' ? 'pr-4' : 'pl-4'

  const handleClick = (): void => {
    const windowWidth = window.innerWidth
    const componentWidth = 120

    const dx = mode === 'input' ? windowWidth - 45 : -componentWidth + 45
    const dy = 20

    const [x, y] = current.position

    setCameraPosition(x, y, 'C', 20)
  }

  return (
    <button
      className={`${p} ${border} flex-grow pt-2 pb-2 flex flex-row justify-start items-center border-dark transition-colors duration-75 hover:bg-gray-300`}
      onClick={handleClick}
    >
      {body}
    </button>
  )
}

export default React.memo(StaticComponentParameter)
