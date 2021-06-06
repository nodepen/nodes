import React, { useMemo } from 'react'
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
  }, [sourceElement])

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
        <div key={`params-for-${el.id}`} className="w-full flex items-stretch mb-4">
          <div className="w-12 pt-1 flex flex-col justify-start items-center">
            <img width="24" height="24" src={`data:image/png;base64,${template.icon}`} />
          </div>
          <div className="flex-grow flex flex-col justify-start">
            {params.map((p, i) => (
              <div
                key={`param-for-${el.id}=${i}`}
                className="pl-1 pr-1 flex justify-start items-center h-8 hover:bg-green rounded-sm"
              >
                <ParameterIcon size="sm" type={p.type} />
                <p>{p.name}</p>
                <p>({p.nickname})</p>
              </div>
            ))}
          </div>
        </div>
      )
    })
  }, [elements])

  return (
    <div className="w-full flex flex-col pointer-events-auto bg-green">
      <div className="w-full flex items-stretch justify-start">
        {sourceLabel}
        <div
          className="p-2 flex-grow flex flex-col justify-start bg-pale rounded-sm overflow-y-auto no-scrollbar"
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
