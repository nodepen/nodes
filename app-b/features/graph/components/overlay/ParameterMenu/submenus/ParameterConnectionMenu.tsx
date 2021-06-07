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
  const { connect, setProvisionalWire, clearProvisionalWire } = useGraphDispatch()
  const { type: sourceType } = useParameterMenuSource()
  const { from, to } = useParameterMenuConnection()
  const { setParameterMenuConnection } = useOverlayDispatch()

  const fromElement = elements[from?.elementId ?? 'unset'] as NodePen.Element<'static-component'>
  const fromParameter = fromElement?.template.outputs[fromElement?.current.outputs[from?.parameterId ?? 'unset']]

  const toElement = elements[to?.elementId ?? 'unset'] as NodePen.Element<'static-component'>
  const toParameter = toElement?.template.inputs[toElement?.current.inputs[to?.parameterId ?? 'unset']]

  const { elementId, parameterId: sourceParameterId } = (sourceType === 'input' ? to : from) ?? {}

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

    return candidates.map((el, ei) => {
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
            className={`${
              ei === 0 ? '' : 'mt-2'
            } w-full pt-2 pb-2 box-border flex justify-start items-center rounded-sm bg-pale top-0 z-20`}
          >
            <div className="w-12 flex flex-col justify-center items-center">
              <img width="24" height="24" src={`data:image/png;base64,${template.icon}`} />
            </div>
            <p className="text-lg text-darkgreen font-medium">{template.name}</p>
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="#7BBFA5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          {params.map((p, i) => (
            <button
              key={`param-for-${el.id}=${i}`}
              className="ml-2 mr-2 flex justify-start items-center h-8 hover:bg-green rounded-sm"
              onClick={() => {
                const parameterId = Object.keys(el.current[sourceType === 'input' ? 'outputs' : 'inputs'])[i]

                const [x, y] = el.current.position
                const [dx, dy] = el.current.anchors[parameterId]

                setCameraPosition(x + dx, y + dy - 45, 'C')

                setParameterMenuConnection({
                  type: sourceType === 'input' ? 'output' : 'input',
                  elementId: el.id,
                  parameterId,
                })

                if (!elementId || !sourceParameterId) {
                  return
                  console.log('Not setting provisional wire!')
                }

                const sourceReference = { elementId, parameterId: sourceParameterId }
                const targetReference = { elementId: el.id, parameterId }

                setProvisionalWire({
                  from: sourceType === 'output' ? sourceReference : targetReference,
                  to: sourceType === 'output' ? targetReference : sourceReference,
                })
              }}
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
  }, [elements, sourceElement, sourceType, elementId, navigateTo, targetElement, targetParameter, sourceParameterId])

  const ready = !!from && !!to

  const handleConnect = (): void => {
    if (!from || !to) {
      return
    }

    connect({
      mode: 'replace',
      from: {
        elementId: from.elementId,
        parameterId: from.parameterId,
      },
      to: {
        elementId: to.elementId,
        parameterId: to.parameterId,
      },
    })

    clearProvisionalWire()
    onClose()
  }

  const handleClose = (): void => {
    clearProvisionalWire()
    onClose()
  }

  return (
    <div className="w-full p-2 flex flex-col pointer-events-auto bg-green">
      {/* <h3 className="mb-2 text-sm font-semibold pl-2 text-darkgreen">
        SELECT {sourceType === 'input' ? 'SOURCE OUTPUT' : 'TARGET INPUT'}:
      </h3> */}
      <div className="w-full flex pb-2 items-stretch justify-start">
        <div className="flex-grow h-32 flex flex-col pt-2 pb-2 justify-start bg-pale rounded-sm overflow-y-auto no-scrollbar">
          {candidatesList}
        </div>
      </div>
      <div className="w-full flex justify-start items-center">
        <button
          disabled={!ready}
          className={`${
            ready ? 'text-darkgreen' : 'text-swampgreen'
          } bg-none rounded-sm p-1 pl-2 pr-2 text-sm font-semibold hover:bg-swampgreen transition-colors duration-75`}
          onClick={handleConnect}
        >
          CONNECT
        </button>
        <button
          className="bg-none rounded-sm p-1 pl-2 pr-2 mr-2 text-sm font-semibold text-darkgreen hover:bg-swampgreen transition-colors duration-75"
          onClick={handleClose}
        >
          CANCEL
        </button>
      </div>
    </div>
  )
}
