import { Grasshopper } from 'glib'
import { useGenericMenuManager } from 'features/graph/components/overlay/GenericMenu/hooks'
import React from 'react'
import { useDebugRender } from '@/hooks'

type AboutMenuProps = {
  component: Grasshopper.Component
}

const AboutMenu = ({ component }: AboutMenuProps): React.ReactElement => {
  const { name, nickname, description } = component

  const { onCancel } = useGenericMenuManager()

  useDebugRender('About Menu')

  return (
    <div>
      <p>
        {name} {nickname}
      </p>
      <p>{description}</p>
      <button onClick={onCancel}>Ok thanks</button>
    </div>
  )
}

export default React.memo(AboutMenu)
