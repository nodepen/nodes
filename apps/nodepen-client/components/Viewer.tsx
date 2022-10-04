import React from 'react'
import { NodesApp } from '@nodepen/nodes'

const Viewer = (): React.ReactElement => {
  return <NodesApp document={{ id: '', nodes: {}, templates: {}, version: 1 }} />
}

export default Viewer
