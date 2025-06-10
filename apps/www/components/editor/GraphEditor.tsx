'use client'

import type React from 'react'
import { useCallback, useState } from 'react'
import { print } from 'graphql'
import gql from 'graphql-tag'
import type * as NodePen from '@nodepen/core'
import { NodesApp, DocumentView, SpeckleModelView } from '@nodepen/nodes'
import type { NodesAppState, NodesAppCallbacks } from '@nodepen/nodes'

type NodesAppContainerProps = {
  document: NodePen.Document
  templates: NodePen.NodeTemplate[]
}

const NodesAppContainer = ({ document, templates }: NodesAppContainerProps): React.ReactElement => {
  const stream = {
    id: process.env.NEXT_PUBLIC_STREAM_ID!,
    url: process.env.NEXT_PUBLIC_STREAM_URL!,
    token: process.env.NEXT_PUBLIC_STREAM_TOKEN!,
  }

  // const document: NodePen.Document = {
  //   id: '',
  //   version: 1,
  //   nodes: {},
  //   configuration: {
  //     inputs: [],
  //     outputs: []
  //   }
  // }

  const solution: NodePen.DocumentSolutionData | undefined = undefined

  return (
    <NodesApp document={document} templates={templates} solution={solution}>
      <DocumentView editable />
      <SpeckleModelView stream={stream} rootObjectId={undefined} />
    </NodesApp>
  )
}

export default NodesAppContainer
