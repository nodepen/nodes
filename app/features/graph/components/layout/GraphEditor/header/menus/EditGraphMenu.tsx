import React, { useEffect, useRef } from 'react'
import { gql, useMutation } from '@apollo/client'
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
      <h3>Edit Name</h3>
      <div className="w-full flex items-center justify-start">
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
          className="w-10 h-10 mr-2 rounded-md bg-swampgreen flex items-center justify-center"
          style={{ minWidth: 40 }}
          onClick={handleRename}
        >
          K
        </button>
      </div>
    </div>
  )
}
