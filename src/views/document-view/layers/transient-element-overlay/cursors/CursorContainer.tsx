import React from 'react'
import { WireEditCursor } from './wire-edit-cursor'
import type { Cursor } from '../types'

type CursorProps = {
  cursor: Cursor | null
}

export const CursorContainer = ({ cursor }: CursorProps) => {
  if (!cursor) {
    return null
  }

  switch (cursor.context.type) {
    case 'wire-edit': {
      const { configuration, context } = cursor
      return <WireEditCursor configuration={configuration} context={context} />
    }
  }
}
