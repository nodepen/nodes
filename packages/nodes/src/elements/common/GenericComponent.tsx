import React from 'react'

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

export const GenericComponent = ({ id, template, callbacks }): React.ReactElement => {
  return <></>
}
