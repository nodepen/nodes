<img src="np-banner.png" >

<div>
<img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/NodePenIO?style=social">
<img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/nodepen/nodes?style=social">
&nbsp;
<img alt="GitHub branch checks state" src="https://img.shields.io/github/checks-status/nodepen/nodes/main?style=flat-square">
<img alt="npm (scoped)" src="https://img.shields.io/npm/v/@nodepen/nodes?style=flat-square">
<img alt="GitHub" src="https://img.shields.io/github/license/nodepen/nodes?style=flat-square">
</div>

---
<br />

Nodepen is a web client for Grasshopper. This monorepo is for the main `@nodepen/nodes` React app library and its supporting packages.

This project is under active development towards a 2.0 release that will:

- Publish useful bits of the [previous release](https://github.com/nodepen/nodes/releases/tag/1.0.0) as javascript and React modules
- Integrate with Speckle for backend processes and frontend geometry

## Features

- Compose, execute, and view results from your Grasshopper graphs in the browser
- Or, upload an existing script and continue working on the web
- Easily pin any number of parameters for a quick configurator-like experience
- Open the same graph in multiple browser windows for the "two screen" UX we've come to love with Rhino and Grasshopper
- Download your current graph to continue work in Grasshopper offline

## Quickstart

Minimal

```ts
import type * as NodePen from '@nodepen/core'
import { NodesApp, DocumentView, SpeckleModelView } from '@nodepen/nodes'

const MyApp = () => {
    const document: NodePen.Document = { ...yourData }
    const streamId = "your-speckle-stream-id"

    return (
        <NodesApp document={document}>
            <DocumentView />
            <SpeckleModelView streamId={streamId} />
        </NodesApp>
    )
}
```

Not minimal:

```ts
import { useState, useCallback } from 'react'
import type * as NodePen from '@nodepen/core'
import { NodesApp, DocumentView, SpeckleModelView } from '@nodepen/nodes'
import type { NodesAppState, NodesAppCallbacks } from '@nodepen/nodes'

type MyAppProps = {
    templates: NodePen.NodeTemplate[]
}

const MyApp = ({ templates }: MyAppProps) => {
    const [document, setDocument] = useState<NodePen.Document>()
    const [solution, setSolution] = useState<NodePen.SolutionData>()

    const handleDocumentChange = useCallback((state: NodesAppState) => {
        const { document } = state
        // React to document changes
    }, [])

    const handleExpireSolution = useCallback((state: NodesAppState) => {
        const { document, solution } = state
        // React to new solution requests

        const fetchSolution = async (): Promise<NodePen.SolutionData> => {
            const response = await fetch('your-endpoint', { method: 'POST', body: { id: solution.id, document }})
            const data = await response.json()

            // Do work with solution data

            return data
        }

        fetchSolution().then((solutionData) => setSolution(solutionData))
    }, [])

    const callbacks: NodesAppCallbacks = {
        handleDocumentChange,
        handleExpireSolution
    }

    return (
        <NodesApp document={document} templates={templates} solution={solution} {...callbacks}>
            <DocumentView editable />
            <SpeckleModelView streamId={streamId} />
        </NodesApp>
    )
}
```

## API

WIP

## Development

WIP

## Attribution

Rhinoceros and Grasshopper are registered trademarks of [Robert McNeel & Associates](https://www.rhino3d.com).

All 3D visuals are powered by the [Speckle Viewer](https://github.com/specklesystems/speckle-server/tree/main/packages/viewer).

Previous drafts of NodePen included the ["RestHopper"](https://github.com/RESThopper/resthopper.grasshopper) headless Grasshopper prototype developed at the [2018 AEC Tech Hackathon](http://core.thorntontomasetti.com/aec-tech-2018/aec-tech-2018-hackathon/2018-aec-tech-hackathon-github-repos/).
