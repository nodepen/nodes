import React, { useCallback, useMemo } from 'react'
import { NodePen, assert } from 'glib'
import { useGraphDispatch, useGraphElements } from 'features/graph/store/graph/hooks'
import { useParameterMenuConnection } from 'features/graph/store/overlay/hooks'
import { useSetCameraPosition } from 'features/graph/hooks'
import { distance, listParameters } from 'features/graph/utils'
import { ParameterIcon } from '../../../icons'

type ConnectionMenuProps = {
  onClose: () => void
}

export const ParameterConnectionMenu = ({ onClose }: ConnectionMenuProps): React.ReactElement => {
  const elements = useGraphElements()
  const { sourceType, from, to } = useParameterMenuConnection()

  const { elementId, parameterId } = (sourceType === 'input' ? to : from) ?? {}

  const sourceElement = elements[elementId ?? 'unset']

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

  const sourceLabel = useMemo(() => {
    if (!sourceElement) {
      return null
    }

    if (!(assert.element.isStaticComponent(sourceElement) || assert.element.isStaticParameter(sourceElement))) {
      return null
    }

    const sourceParameter =
      sourceElement.template[sourceType === 'input' ? 'inputs' : 'outputs'][
        sourceElement.current[sourceType === 'input' ? 'inputs' : 'outputs'][parameterId ?? 'unset']
      ]

    return (
      <div className="w-12 flex flex-col items-center justify-center">
        <img />
        <ParameterIcon type={sourceParameter.type} size="sm" />
        <p>{sourceParameter.nickname}</p>
      </div>
    )
  }, [sourceElement, parameterId, sourceType])

  const candidatesList = useMemo(() => {
    if (!sourceElement) {
      return null
    }

    const candidates = Object.values(elements)
      .filter(({ current }) => assert.element.isGraphElement(current))
      .filter((el) => el.id !== elementId)
      .sort((candidate) => distance(candidate.current.position, sourceElement.current.position))

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
            className="w-full mt-2 pt-2 pb-2 box-border flex justify-start items-center rounded-sm sticky bg-pale top-0"
          >
            <div className="w-12 flex flex-col justify-center items-center">
              <img width="24" height="24" src={`data:image/png;base64,${template.icon}`} />
            </div>
            <p>{template.name}</p>
          </button>
          {params.map((p, i) => (
            <button
              key={`param-for-${el.id}=${i}`}
              className="pr-1 flex justify-start items-center h-8 hover:bg-green rounded-sm"
            >
              <div className="w-12 h-8 flex flex-col justify-center items-center">
                <ParameterIcon size="sm" type={p.type} />
              </div>

              <p>{p.name}</p>
              <p>({p.nickname})</p>
            </button>
          ))}
        </>
      )
    })
  }, [elements, sourceElement, sourceType, elementId])

  return (
    <div className="w-full flex flex-col pointer-events-auto bg-green">
      <div className="w-full flex items-stretch justify-start">
        {sourceLabel}
        <div
          className="flex-grow flex flex-col pl-2 pr-2 justify-start bg-pale rounded-sm overflow-y-auto no-scrollbar"
          style={{ maxHeight: '150px' }}
        >
          {candidatesList}
        </div>
      </div>
      <button onClick={onClose} className="w-full p-4 bg-red-400" />
      <p>{sourceType}</p>
      <p>{from?.parameterId ?? 'unset'}</p>
      <p>{to?.parameterId ?? 'unset'}</p>
    </div>
  )
}
