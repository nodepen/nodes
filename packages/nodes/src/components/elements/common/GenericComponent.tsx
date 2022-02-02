import React from 'react'
import { core } from '@nodepen/core'

type GenericComponentProps = {
  id: string
  template: {
    label: string
  }
  callbacks: {
    onLongHover: (event: React.PointerEvent<HTMLDivElement>, context: GenericComponentProps['template']) => void
  }
  current: {
    solver: 'enabled' | 'disabled'
    visibility: 'visible' | 'hidden'
  }
}

export const GenericComponent = (): React.ReactElement => {
  return <div className="w-6 h-6 bg-red-400">{core}</div>
}
