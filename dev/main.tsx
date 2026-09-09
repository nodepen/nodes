import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { NodesApp, NodesAppPanel, useNodesApp } from "../dist/index.mjs"
import "../dist/styles.css";
import templates from "./templates.json";
import { Agent } from "./agent";
import { doc } from "./document";

const rootEl = document.getElementById("root")!
const root = createRoot(rootEl)

const solution = {
    solutionModelUrl: null,
    solutionStatusMessages: {
        document: {
            status: 'ok' as const,
            message: 'Ok message here.'
        },
        model: {
            status: 'error' as const,
            message: 'Failed to do something!'
        }
    },
    documentRuntimeData: {
        durationMs: 100,
        exceptionMessages: []
    },
    nodeSolutionData: {
        '62509613-274a-4fc0-a382-caeb7704ab9f': {
            nodeInstanceId: '62509613-274a-4fc0-a382-caeb7704ab9f',
            nodeRuntimeData: {
                durationMs: 0,
                messages: [
                    {
                        level: 'error',
                        message: 'Failed to collect data!'
                    }
                ]
            },
            portSolutionData: {}
        }
    }
}

const assets = {
    models: {
        'test-model': '/test.3dm'
    }
}

let presence = {
    sessions: {
        ['demo-id']: {
            userId: 'fake-id',
            color: '#79D3F6',
            name: 'John Grasshopper'
        },
        ['demo-agent']: {
            userId: 'agent',
            color: '#79D3F6',
            name: "Agent Blue",
            kind: 'agent',
            status: 'working',
            chirp: 'Howdy!'
        }
    },
    cursors: {
        ['demo-id']: {
            x: 100,
            y: 100
        },
        ['demo-agent']: {
            x: 1000,
            y: 600
        }
    },
    cameras: {}
}

const flags = {
    isEditable: true,
    isControlsEditable: true,
    // isThumbnail: true,
    hideInterface: false,
    hideScript: false
}

const features = {
    enableAgentButton: true
}

const preferences = {
    parameterTypeIcons: true
}

root.render(<StrictMode>
    <div style={{ width: '100vw', height: '100vh' }}>
        <NodesApp document={doc} templates={templates as any} solution={solution} assets={assets} presence={presence} flags={flags} features={features} preferences={preferences}>
            <Agent />
        </NodesApp>
    </div>
</StrictMode>)