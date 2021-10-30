import React, { useState, useRef, useEffect } from 'react'
import { NodePen } from 'glib'
import { useGraphDispatch } from '@/features/graph/store/graph/hooks'
import { getDataTreePathString } from '@/features/graph/utils'

type PanelUserInputProps = {
  elementId: string
  initialValue: string
}

export const PanelUserInput = ({ elementId, initialValue }: PanelUserInputProps): React.ReactElement => {
  const [isEditing, setIsEditing] = useState(false)
  const [internalValue, setInternalValue] = useState(initialValue)

  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { updateElement, updateSelection } = useGraphDispatch()

  const handleSubmit = (): void => {
    setIsEditing(false)

    const path = getDataTreePathString([0])
    updateElement({
      id: elementId,
      type: 'panel',
      data: {
        values: {
          output: {
            [path]: [
              {
                type: 'text',
                value: internalValue,
              },
            ],
          },
        },
      },
    })
  }

  const handleDoubleClick = (): void => {
    setIsEditing(true)
    updateSelection({ mode: 'default', type: 'id', ids: [] })

    setTimeout(() => {
      inputRef?.current?.focus()
      inputRef?.current?.select()
    }, 50)
  }

  const shiftKeyPressed = useRef(false)

  return (
    <>
      <div
        className={`${
          isEditing ? 'justify-start' : 'justify-center'
        } w-full h-full bg-none p-2 pt-1 rounded-sm flex flex-col items-center`}
        onDoubleClick={handleDoubleClick}
      >
        <textarea
          className={`${
            isEditing ? 'pointer-events-auto' : 'select-none pointer-events-none'
          } w-full h-full resize-none font-panel font-thin text-dark text-sm text-center`}
          ref={inputRef}
          disabled={!isEditing}
          value={internalValue}
          onScroll={(e) => {
            e.stopPropagation()
          }}
          onChange={(e) => setInternalValue(e.target.value.substring(0, 1024))}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            e.stopPropagation()

            switch (e.key.toLowerCase()) {
              case 'shift': {
                shiftKeyPressed.current = true
                break
              }
              case 'enter': {
                if (shiftKeyPressed.current) {
                  e.preventDefault()
                  handleSubmit()
                  break
                }
              }
            }
          }}
          onKeyUp={(e) => {
            e.stopPropagation()

            switch (e.key.toLowerCase()) {
              case 'shift': {
                shiftKeyPressed.current = false
                break
              }
            }
          }}
          onPointerDown={(e) => {
            e.stopPropagation()
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
          }}
        />
      </div>
      <style jsx>{`
        textarea {
          background: none;
        }

        textarea:disabled {
          background: none;
        }

        textarea:focus {
          outline: none;
        }
      `}</style>
    </>
  )
}
