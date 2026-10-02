import { NodesAppPanel, useNodesApp } from "../dist/index.mjs"

export const Agent = () => {
    const { apply } = useNodesApp()

    return <NodesAppPanel target="agent">
        Howdy!!
        <button onClick={() => {
            apply((state) => {
                state.ui.sidebar.isAgentOpen = false
            })
        }}>Close</button>
    </NodesAppPanel>
}