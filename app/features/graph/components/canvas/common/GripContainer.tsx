import React from 'react'
import { NodePen } from 'glib'

type GripContainerProps = {
  children: JSX.Element
  mode: 'input' | 'output'
}

/**
 * The generic grip container wraps its child and attaches all wire creation events and logic.
 */
const GripContainer = ({ children, mode }: GripContainerProps): React.ReactElement => {
  return <></>
}
