import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NodesApp, DocumentView } from "../dist/index.mjs"
import "../dist/styles.css";

const rootEl = document.getElementById("root")!
const root = createRoot(rootEl)

const doc = {
  id: 'voronoi',
  version: 1 as const,
  nodes: {},
  meta: {
    name: 'My Document',
    speckle: {
      linkedModel: {
        id: '',
        name: '',
        rootObjectId: undefined
      }
    }
  },
  configuration: {
    inputs: [],
    outputs: []
  }
}

root.render(
  <StrictMode>
    <div style={{ width: '100vw', height: '100vh' }}>
      <NodesApp document={doc} templates={[]}>
        <DocumentView editable />
      </NodesApp>
    </div>
  </StrictMode>
)