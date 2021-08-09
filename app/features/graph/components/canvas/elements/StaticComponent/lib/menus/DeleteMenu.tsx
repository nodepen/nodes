import React from 'react'
import { NodePen } from 'glib'
import { useGenericMenuManager } from 'features/graph/components/overlay/GenericMenu/hooks'
import { useDebugRender } from 'hooks'
import { useGraphDispatch } from 'features/graph/store/graph/hooks'

type DeleteMenuProps = {
  element: NodePen.Element<'static-component'>
}

const DeleteMenu = ({ element }: DeleteMenuProps): React.ReactElement => {
  const { name, icon } = element.template

  const { deleteElements } = useGraphDispatch()
  const { onCancel, onClose } = useGenericMenuManager()

  useDebugRender('Delete Menu')

  const handleDelete = (): void => {
    deleteElements([element.id])
    onClose()
  }

  return (
    <div className="w-full flex flex-col justify-start">
      <div className="w-full flex flex-col">
        <div className="w-full h-12 flex justify-start items-center">
          <h2 className="whitespace-normal">
            <svg
              className="inline w-6 h-6 mr-2"
              fill="none"
              stroke="#093824"
              viewBox="0 2 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <h3 className="inline text-lg">Are you sure you want to delete</h3>
            <img
              width="24px"
              height="24px"
              className="inline ml-2 mr-2"
              draggable="false"
              src={`data:image/png;base64,${icon}`}
              alt={name}
            />
            <h3 className="inline font-medium text-lg">{name}</h3>
          </h2>
        </div>
        <p className="whitespace-normal ml-8">0 connections</p>
        <p className="whitespace-normal ml-8 mb-8">0 values</p>
        <div className="ml-8 w-full h-8 flex justify-start items-center">
          <button
            className="flex items-center justify-start rounded-full mr-2 p-2 h-8 border-2 border-darkgreen bg-darkgreen"
            onClick={handleDelete}
          >
            <svg
              className="w-3 h-3 overflow-visible"
              fill="none"
              stroke="#7BBFA5"
              viewBox="4 4 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </button>
          <button
            className="flex items-center justify-start rounded-full p-2 h-8 border-2 border-swampgreen"
            onClick={onCancel}
          >
            <svg width={12} height={12} viewBox="0 0 10 10">
              <line
                x1={1}
                y1={1}
                x2={9}
                y2={9}
                fill="none"
                stroke="#7BBFA5"
                strokeWidth="2px"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1={1}
                y1={9}
                x2={9}
                y2={1}
                fill="none"
                stroke="#7BBFA5"
                strokeWidth="2px"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(DeleteMenu)
