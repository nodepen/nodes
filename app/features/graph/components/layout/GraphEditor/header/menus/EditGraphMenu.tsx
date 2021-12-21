import React, { useEffect, useRef } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Typography } from '@/features/common'
import { useGraphDispatch } from '@/features/graph/store/graph/hooks'

type EditGraphMenuProps = {
  graphId: string
  initialValue: string
  onClose: () => void
}

export const EditGraphMenu = ({ graphId, initialValue, onClose }: EditGraphMenuProps): React.ReactElement => {
  const { rename } = useGraphDispatch()

  const [renameGraph] = useMutation(
    gql`
      mutation RenameGraph($graphId: String!, $name: String!) {
        renameGraph(graphId: $graphId, name: $name) {
          name
        }
      }
    `
  )

  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!nameInputRef.current) {
      return
    }

    const el = nameInputRef.current

    setTimeout(() => {
      el.focus()
    }, 250)
  }, [])

  const handleRename = (): void => {
    if (!nameInputRef.current) {
      return
    }

    const currentName = initialValue
    const nextName = nameInputRef.current.value

    if (!nextName || nextName.length <= 0 || nextName.length > 100) {
      return
    }

    onClose()

    rename(nextName)

    renameGraph({
      variables: {
        graphId,
        name: nextName,
      },
    })
      .then(() => {
        // Do nothing
      })
      .catch((err) => {
        console.error(err)
        rename(currentName)
      })
  }

  return (
    <div className="w-full p-2 rounded-md bg-green flex flex-col" onPointerDown={(e) => e.stopPropagation()}>
      <div className="w-full mb-2 flex items-center justify-start">
        <input
          className="flex-grow h-10 pl-2 pr-2 mr-2 rounded-md bg-pale"
          ref={nameInputRef}
          defaultValue={initialValue}
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUp={(e) => {
            e.stopPropagation()

            if (e.key.toLowerCase() === 'enter') {
              handleRename()
            }
          }}
        />
        <button
          className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-swampgreen"
          style={{ minWidth: 40 }}
          onClick={handleRename}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      <div className="buttons-container">
        <button className="w-full h-8 pl-2 pr-2 flex items-center justify-center rounded-md hover:bg-swampgreen">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="#093824"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <div className="w-min pointer-events-none">
            <Typography.Label size="sm" color="darkgreen">
              Duplicate
            </Typography.Label>
          </div>
        </button>
        <button className="w-full h-8 pl-2 pr-2 flex items-center justify-center rounded-md hover:bg-swampgreen">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="#093824"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <div className="w-min pointer-events-none">
            <Typography.Label size="sm" color="darkgreen">
              Delete
            </Typography.Label>
          </div>
        </button>
      </div>
      <style jsx>{`
        .buttons-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 8px;
        }
      `}</style>
    </div>
  )
}
