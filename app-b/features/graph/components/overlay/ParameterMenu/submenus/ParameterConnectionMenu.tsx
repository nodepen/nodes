import React, { useCallback, useMemo } from 'react'
import { NodePen, assert } from 'glib'
import { useGraphDispatch, useGraphElements } from 'features/graph/store/graph/hooks'
import {
  useOverlayDispatch,
  useParameterMenuConnection,
  useParameterMenuSource,
} from 'features/graph/store/overlay/hooks'
import { useSetCameraPosition } from 'features/graph/hooks'
import { distance, listParameters } from 'features/graph/utils'
import { ParameterIcon } from '../../../icons'

type ConnectionMenuProps = {
  onClose: () => void
}

export const ParameterConnectionMenu = ({ onClose }: ConnectionMenuProps): React.ReactElement => {
  const elements = useGraphElements()
  const { type: sourceType } = useParameterMenuSource()
  const { from, to } = useParameterMenuConnection()
  const { setParameterMenuConnection } = useOverlayDispatch()

  const fromElement = elements[from?.elementId ?? 'unset'] as NodePen.Element<'static-component'>
  const fromParameter = fromElement?.template.outputs[fromElement?.current.outputs[from?.parameterId ?? 'unset']]

  const toElement = elements[to?.elementId ?? 'unset'] as NodePen.Element<'static-component'>
  const toParameter = toElement?.template.inputs[toElement?.current.inputs[to?.parameterId ?? 'unset']]

  const { elementId, parameterId } = (sourceType === 'input' ? to : from) ?? {}

  const sourceElement = elements[elementId ?? 'unset']

  const targetElement = sourceType === 'input' ? fromElement : toElement
  const targetParameter = sourceType === 'input' ? fromParameter : toParameter

  const setCameraPosition = useSetCameraPosition()
  const navigateTo = useCallback(
    (elementId: string, parameterId?: string) => {
      const targetElement = elements[elementId]

      if (!targetElement) {
        return
      }

      const [x, y] = targetElement.current.position
      const { width, height } = targetElement.current.dimensions

      if (!parameterId) {
        setCameraPosition(x + width / 2, y, 'C')
      }
    },
    [elements, setCameraPosition]
  )

  const candidatesList = useMemo(() => {
    if (!sourceElement) {
      return null
    }

    const candidates = Object.values(elements)
      .filter(({ current }) => assert.element.isGraphElement(current))
      .filter((el) => el.id !== elementId)
      .sort((candidate) => distance(candidate.current.position, sourceElement.current.position))
      .reverse()

    return candidates.map((el) => {
      if (!(assert.element.isStaticComponent(el) || assert.element.isStaticParameter(el))) {
        return null
      }

      const template = el.template
      const params = listParameters(el, sourceType === 'input' ? 'output' : 'input')

      return (
        <>
          <button
            key={`params-for-${el.id}`}
            onClick={() => navigateTo(el.id)}
            className="w-full mt-2 pt-2 pb-2 box-border flex justify-start items-center rounded-sm bg-pale top-0 z-20"
          >
            <div className="w-12 flex flex-col justify-center items-center">
              <img width="24" height="24" src={`data:image/png;base64,${template.icon}`} />
            </div>
            <p className="text-lg text-darkgreen font-medium">{template.name}</p>
          </button>
          {params.map((p, i) => (
            <button
              key={`param-for-${el.id}=${i}`}
              className="ml-2 mr-2 flex justify-start items-center h-8 hover:bg-green rounded-sm"
              onClick={() =>
                setParameterMenuConnection({
                  type: sourceType === 'input' ? 'output' : 'input',
                  elementId: el.id,
                  parameterId: Object.keys(el.current[sourceType === 'input' ? 'outputs' : 'inputs'])[i],
                })
              }
            >
              <div className="w-8 h-8 flex flex-col justify-center items-center">
                <div className="w-4 h-4 rounded-full flex justify-center items-center bg-pale border-2 border-darkgreen">
                  {targetElement?.id === el.id &&
                  targetParameter?.name === p.name &&
                  targetParameter?.nickname === p.nickname ? (
                    <div className="w-2 h-2 rounded-full bg-darkgreen" />
                  ) : null}
                </div>
              </div>
              <p className="ml-2 text-sm font-medium font-panel text-darkgreen">
                {p.name}&nbsp;({p.nickname})
              </p>
            </button>
          ))}
        </>
      )
    })
  }, [elements, sourceElement, sourceType, elementId, navigateTo, targetElement, targetParameter])

  return (
    <div className="w-full p-2 flex flex-col pointer-events-auto bg-green">
      <div className="w-full pb-2 grid" style={{ gridTemplateColumns: '1fr 48px 1fr' }}>
        {fromElement ? (
          <div
            className={`${
              sourceType === 'output' ? '' : 'animate-pulse'
            } w-full h-12 flex justify-center items-center rounded-md border-2 bg-white border-darkgreen`}
          >
            <img width="24" height="24" src={`data:image/png;base64,${fromElement.template.icon}`} />
            <ParameterIcon size="sm" type={fromParameter.type} />
            <p>{fromParameter.nickname}</p>
          </div>
        ) : (
          <div className="w-full h-12 flex justify-center items-center rounded-md border-2 border-swampgreen border-dashed"></div>
        )}
        <div className="w-12 h-12 flex justify-center items-center overflow-visible z-20">
          <svg className="w-12 h-12 overflow-visible" viewBox="0 0 10 10">
            <line
              x1="0"
              y1="5"
              x2="10"
              y2="5"
              fill="none"
              stroke="#093824"
              strokeWidth="2px"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="0"
              cy="5"
              r="1"
              fill="#FFF"
              stroke="#093824"
              strokeWidth="2px"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="10"
              cy="5"
              r="1"
              fill="#FFF"
              stroke="#093824"
              strokeWidth="2px"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        {toElement ? (
          <div
            className={`${
              sourceType === 'input' ? '' : 'animate-pulse'
            } w-full h-12 flex justify-center items-center rounded-md border-2 bg-white border-darkgreen`}
          >
            <div className="w-18 h-12 flex justify-center items-center">
              <img width="24" height="24" src={`data:image/png;base64,${toElement.template.icon}`} />
              <ParameterIcon size="sm" type={toParameter.type} />
              <p>{toParameter.nickname}</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-12 flex justify-center items-center rounded-md border-2 border-swampgreen border-dashed">
            <div className="w-18 h-12 flex justify-center items-center"></div>
          </div>
        )}
      </div>
      <h3 className="mb-2 text-sm font-semibold pl-4 text-darkgreen">
        SELECT {sourceType === 'input' ? 'SOURCE OUTPUT' : 'TARGET INPUT'}:
      </h3>
      <div className="w-full flex pb-2 items-stretch justify-start">
        <div className="flex-grow h-32 flex flex-col pt-2 pb-2 justify-start bg-pale rounded-sm overflow-y-auto no-scrollbar">
          {candidatesList}
        </div>
      </div>
      <div className="w-full flex justify-start items-center">
        <button className="bg-none rounded-full p-1 pl-4 pr-4 text-sm font-semibold text-pale bg-darkgreen">
          CONNECT
        </button>
        <button className="bg-none rounded-sm p-2 mr-2 text-sm font-semibold pl-2 text-darkgreen" onClick={onClose}>
          CANCEL
        </button>
      </div>
    </div>
  )
}
