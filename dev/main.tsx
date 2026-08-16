import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { NodesApp, type Document as NodePenDocument } from "../dist/index.mjs"
import "../dist/styles.css";
import templates from "./templates.json";

const rootEl = document.getElementById("root")!
const root = createRoot(rootEl)

const doc: NodePenDocument = {
    id: 'voronoi',
    version: 1 as const,
    nodes: {
        // Integer
        '49db9cc7-28fe-4a93-ab45-ea7f3d847cb2': {
            instanceId: '49db9cc7-28fe-4a93-ab45-ea7f3d847cb2',
            templateId: '2e3ab970-8545-46bb-836c-1c11e5610bce',
            position: { x: 450, y: 100 },
            dimensions: { width: 152, height: 32 },
            status: { isVisible: true, isEnabled: true, isProvisional: false },
            anchors: {
                labelDeltaX: { dx: 21, dy: 0 },
                output: { dx: 152, dy: 16 },
                input: { dx: 0, dy: 16 },
            },
            sources: { input: [] },
            values: {
                output: {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                },
            },
            inputs: { input: 0 },
            outputs: { output: 0 },
            portConfigurations: {
                input: { label: null, flags: [] },
                output: { label: null, flags: [] },
            },
        },
        // Number
        '1f2b7a0a-6668-40cb-aca4-df10b483d01a': {
            instanceId: '1f2b7a0a-6668-40cb-aca4-df10b483d01a',
            templateId: '3e8ca6be-fda8-4aaf-b5c0-3c54c8bb7312',
            position: { x: 450, y: 172 },
            dimensions: { width: 152, height: 32 },
            status: { isVisible: true, isEnabled: true, isProvisional: false },
            anchors: {
                labelDeltaX: { dx: 21, dy: 0 },
                output: { dx: 152, dy: 16 },
                input: { dx: 0, dy: 16 },
            },
            sources: { input: [] },
            values: {
                output: {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                },
            },
            inputs: { input: 0 },
            outputs: { output: 0 },
            portConfigurations: {
                input: { label: null, flags: [] },
                output: { label: null, flags: [] },
            },
        },
        // Text
        '52509613-274a-4fc0-a382-caeb7704ab9f': {
            instanceId: '52509613-274a-4fc0-a382-caeb7704ab9f',
            templateId: '3ede854e-c753-40eb-84cb-b48008f14fd4',
            position: { x: 450, y: 244 },
            dimensions: { width: 152, height: 32 },
            status: { isVisible: true, isEnabled: true, isProvisional: false },
            anchors: {
                labelDeltaX: { dx: 21, dy: 0 },
                output: { dx: 152, dy: 16 },
                input: { dx: 0, dy: 16 },
            },
            sources: { input: [] },
            values: {
                output: {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                },
            },
            inputs: { input: 0 },
            outputs: { output: 0 },
            portConfigurations: {
                input: { label: null, flags: [] },
                output: { label: null, flags: [] },
            },
        },
        // Boolean
        '146313d8-f3ad-485d-913d-72c68b2bbeb4': {
            instanceId: '146313d8-f3ad-485d-913d-72c68b2bbeb4',
            templateId: 'cb95db89-6165-43b6-9c41-5702bc5bf137',
            position: { x: 450, y: 316 },
            dimensions: { width: 152, height: 32 },
            status: { isVisible: true, isEnabled: true, isProvisional: false },
            anchors: {
                labelDeltaX: { dx: 21, dy: 0 },
                output: { dx: 152, dy: 16 },
                input: { dx: 0, dy: 16 },
            },
            sources: { input: [] },
            values: {
                // `createInstance` defaults Boolean params to a `true` value.
                input: {
                    branches: [
                        {
                            order: 0,
                            path: '{0}',
                            values: [
                                { type: 'boolean', description: 'true', order: 0, value: 'true' },
                            ],
                        },
                    ],
                    stats: {
                        branchCount: 1,
                        branchValueCountDomain: [1, 1],
                        treeStructure: 'single',
                        valueTypes: ['boolean'],
                        valueCount: 1,
                    },
                },
            },
            inputs: { input: 0 },
            outputs: { output: 0 },
            portConfigurations: {
                input: { label: null, flags: [] },
                output: { label: null, flags: [] },
            },
        },
        // Number Slider
        'd352057a-fa2d-423a-b8ad-3f9880900b9b': {
            instanceId: 'd352057a-fa2d-423a-b8ad-3f9880900b9b',
            templateId: '57da07bd-ecab-415d-9d86-af36d7073abc',
            position: { x: 850, y: 100 },
            dimensions: { width: 201, height: 36 },
            status: { isVisible: true, isEnabled: true, isProvisional: false },
            anchors: {
                labelDeltaX: { dx: 0, dy: 0 },
                output: { dx: 201, dy: 18 },
                handle: { dx: 0, dy: 0 },
            },
            sources: {},
            values: {
                input: {
                    branches: [
                        {
                            order: 0,
                            path: '{0}',
                            values: [
                                { type: 'number', description: '5', order: 0, value: '5' },
                            ],
                        },
                    ],
                    stats: {
                        branchCount: 1,
                        branchValueCountDomain: [1, 1],
                        treeStructure: 'single',
                        valueTypes: ['number'],
                        valueCount: 1,
                    },
                },
            },
            inputs: {},
            outputs: { output: 0 },
            nodeConfiguration: { min: 0, max: 10, precision: 2 },
            portConfigurations: {
                input: { label: null, flags: [] },
                output: { label: null, flags: [] },
            },
        },
        // Value List
        'a1f2c3d4-5e6f-4789-a0b1-c2d3e4f5a6b7': {
            instanceId: 'a1f2c3d4-5e6f-4789-a0b1-c2d3e4f5a6b7',
            templateId: '00027467-0d24-4fa7-b178-8dc0ac5f42ec',
            position: { x: 850, y: 172 },
            dimensions: { width: 180, height: 36 },
            status: { isVisible: true, isEnabled: true, isProvisional: false },
            anchors: {
                labelDeltaX: { dx: 0, dy: 0 },
                output: { dx: 180, dy: 18 },
            },
            sources: { input: [] },
            values: {
                input: {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                },
            },
            inputs: { input: 0 },
            outputs: { output: 0 },
            nodeConfiguration: {
                listMode: 'dropdown',
                items: [
                    { name: 'Ladybug', expression: '"Ladybug"', isSelected: true },
                    { name: 'Pufferfish', expression: '"Pufferfish"', isSelected: false },
                    { name: 'Weaverbird', expression: '"Weaverbird"', isSelected: false },
                ],
            },
            portConfigurations: {
                input: { label: null, flags: [] },
                output: { label: null, flags: [] },
            },
        },
        // Boolean Toggle
        'b2c3d4e5-6f7a-4890-b1c2-d3e4f5a6b7c8': {
            instanceId: 'b2c3d4e5-6f7a-4890-b1c2-d3e4f5a6b7c8',
            templateId: '2e78987b-9dfb-42a2-8b76-3923ac8bd91a',
            position: { x: 850, y: 224 },
            dimensions: { width: 114, height: 32 },
            status: { isVisible: true, isEnabled: true, isProvisional: false },
            anchors: {
                labelDeltaX: { dx: 0, dy: 0 },
                output: { dx: 114, dy: 16 },
            },
            sources: { input: [] },
            values: {
                input: {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                },
            },
            inputs: { input: 0 },
            outputs: { output: 0 },
            nodeConfiguration: { value: false },
            portConfigurations: {
                input: { label: null, flags: [] },
                output: { label: null, flags: [] },
            },
        },
        // Series
        'f48cf9d3-3388-4972-af4b-d496b6e7d86d': {
            instanceId: 'f48cf9d3-3388-4972-af4b-d496b6e7d86d',
            templateId: 'e64c5fb1-845c-4ab1-8911-5f338516ba67',
            position: { x: 1100, y: 100 },
            dimensions: { width: 152, height: 130 },
            status: { isVisible: true, isEnabled: true, isProvisional: false },
            anchors: {
                labelDeltaX: { dx: 76, dy: 0 },
                '69b7b09c-b325-49d9-ab00-0c87f01556cc': { dx: 0, dy: 25 },
                '12c671a4-36bc-4375-b3d2-e126fc74b153': { dx: 0, dy: 65 },
                '5b27c6cb-59d3-4cd5-bf74-def2dfdeab87': { dx: 0, dy: 105 },
                'b75e481e-f13c-41f0-a0b0-1ffe0e4f36d0': { dx: 152, dy: 65 },
            },
            sources: {
                '69b7b09c-b325-49d9-ab00-0c87f01556cc': [],
                '12c671a4-36bc-4375-b3d2-e126fc74b153': [],
                '5b27c6cb-59d3-4cd5-bf74-def2dfdeab87': [],
            },
            values: {
                '69b7b09c-b325-49d9-ab00-0c87f01556cc': {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                },
                '12c671a4-36bc-4375-b3d2-e126fc74b153': {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                },
                '5b27c6cb-59d3-4cd5-bf74-def2dfdeab87': {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                },
            },
            inputs: {
                '69b7b09c-b325-49d9-ab00-0c87f01556cc': 0,
                '12c671a4-36bc-4375-b3d2-e126fc74b153': 1,
                '5b27c6cb-59d3-4cd5-bf74-def2dfdeab87': 2,
            },
            outputs: {
                'b75e481e-f13c-41f0-a0b0-1ffe0e4f36d0': 0,
            },
            portConfigurations: {
                '69b7b09c-b325-49d9-ab00-0c87f01556cc': { label: null, flags: [] },
                '12c671a4-36bc-4375-b3d2-e126fc74b153': { label: null, flags: [] },
                '5b27c6cb-59d3-4cd5-bf74-def2dfdeab87': { label: null, flags: [] },
                'b75e481e-f13c-41f0-a0b0-1ffe0e4f36d0': { label: null, flags: [] },
            },
        },
        // Point
        '62509613-274a-4fc0-a382-caeb7704ab9f': {
            instanceId: '62509613-274a-4fc0-a382-caeb7704ab9f',
            templateId: 'fbac3e32-f100-4292-8692-77240a42fd1a',
            position: { x: 650, y: 100 },
            dimensions: { width: 152, height: 32 },
            status: { isVisible: true, isEnabled: true, isProvisional: false },
            anchors: {
                labelDeltaX: { dx: 21, dy: 0 },
                output: { dx: 152, dy: 16 },
                input: { dx: 0, dy: 16 },
            },
            sources: { input: [] },
            values: {
                output: {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                },
            },
            inputs: { input: 0 },
            outputs: { output: 0 },
            portConfigurations: {
                input: { label: null, flags: [] },
                output: { label: null, flags: [] },
            },
        },
        // Line
        '5328049d-b1db-41d4-ba74-a23ccf89bafe': {
            instanceId: '5328049d-b1db-41d4-ba74-a23ccf89bafe',
            templateId: '8529dbdf-9b6f-42e9-8e1f-c7a2bde56a70',
            position: { x: 650, y: 172 },
            dimensions: { width: 152, height: 32 },
            status: { isVisible: true, isEnabled: true, isProvisional: false },
            anchors: {
                labelDeltaX: { dx: 21, dy: 0 },
                output: { dx: 152, dy: 16 },
                input: { dx: 0, dy: 16 },
            },
            sources: { input: [] },
            values: {
                output: {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                },
            },
            inputs: { input: 0 },
            outputs: { output: 0 },
            portConfigurations: {
                input: { label: null, flags: [] },
                output: { label: null, flags: [] },
            },
        },
        // Brep
        '1200d2bd-aa00-486e-8e8a-fdda17426ef1': {
            instanceId: '1200d2bd-aa00-486e-8e8a-fdda17426ef1',
            templateId: '919e146f-30ae-4aae-be34-4d72f555e7da',
            position: { x: 650, y: 244 },
            dimensions: { width: 152, height: 32 },
            status: { isVisible: true, isEnabled: true, isProvisional: false },
            anchors: {
                labelDeltaX: { dx: 21, dy: 0 },
                output: { dx: 152, dy: 16 },
                input: { dx: 0, dy: 16 },
            },
            sources: { input: [] },
            values: {
                output: {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                },
            },
            inputs: { input: 0 },
            outputs: { output: 0 },
            portConfigurations: {
                input: { label: null, flags: [] },
                output: { label: null, flags: [] },
            },
        },
        // Mesh
        'dc6e2acd-453a-4b94-983b-30237e49279a': {
            instanceId: 'dc6e2acd-453a-4b94-983b-30237e49279a',
            templateId: '1e936df3-0eea-4246-8549-514cb8862b7a',
            position: { x: 650, y: 316 },
            dimensions: { width: 152, height: 32 },
            status: { isVisible: true, isEnabled: true, isProvisional: false },
            anchors: {
                labelDeltaX: { dx: 21, dy: 0 },
                output: { dx: 152, dy: 16 },
                input: { dx: 0, dy: 16 },
            },
            sources: { input: [] },
            values: {
                output: {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                },
            },
            inputs: { input: 0 },
            outputs: { output: 0 },
            portConfigurations: {
                input: { label: null, flags: [] },
                output: { label: null, flags: [] },
            },
        },
        // Circle
        '756ffe4e-3d91-451e-a95b-9021a528a2b2': {
            instanceId: '756ffe4e-3d91-451e-a95b-9021a528a2b2',
            templateId: 'd1028c72-ff86-4057-9eb0-36c687a4d98c',
            position: { x: 650, y: 388 },
            dimensions: { width: 152, height: 32 },
            status: { isVisible: true, isEnabled: true, isProvisional: false },
            anchors: {
                labelDeltaX: { dx: 21, dy: 0 },
                output: { dx: 152, dy: 16 },
                input: { dx: 0, dy: 16 },
            },
            sources: { input: [] },
            values: {
                output: {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                },
            },
            inputs: { input: 0 },
            outputs: { output: 0 },
            portConfigurations: {
                input: { label: null, flags: [] },
                output: { label: null, flags: [] },
            },
        },
        // Curve
        '66c62c08-bec7-4f79-b35c-ce6a51f433fc': {
            instanceId: '66c62c08-bec7-4f79-b35c-ce6a51f433fc',
            templateId: 'd5967b9f-e8ee-436b-a8ad-29fdcecf32d5',
            position: { x: 650, y: 460 },
            dimensions: { width: 152, height: 32 },
            status: { isVisible: true, isEnabled: true, isProvisional: false },
            anchors: {
                labelDeltaX: { dx: 21, dy: 0 },
                output: { dx: 152, dy: 16 },
                input: { dx: 0, dy: 16 },
            },
            sources: { input: [] },
            values: {
                output: {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                },
            },
            inputs: { input: 0 },
            outputs: { output: 0 },
            portConfigurations: {
                input: { label: null, flags: [] },
                output: { label: null, flags: [] },
            },
        },
        // Surface
        '2741a069-0f50-4b01-8449-47cf58c15567': {
            instanceId: '2741a069-0f50-4b01-8449-47cf58c15567',
            templateId: 'deaf8653-5528-4286-807c-3de8b8dad781',
            position: { x: 650, y: 532 },
            dimensions: { width: 152, height: 32 },
            status: { isVisible: true, isEnabled: true, isProvisional: false },
            anchors: {
                labelDeltaX: { dx: 21, dy: 0 },
                output: { dx: 152, dy: 16 },
                input: { dx: 0, dy: 16 },
            },
            sources: { input: [] },
            values: {
                output: {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                },
            },
            inputs: { input: 0 },
            outputs: { output: 0 },
            portConfigurations: {
                input: { label: null, flags: [] },
                output: { label: null, flags: [] },
            },
        }
    },
    meta: {
        name: 'My Document',
    },
    controls: {
        input: [
            {
                order: 0,
                ref: {
                    nodeInstanceId: '52509613-274a-4fc0-a382-caeb7704ab9f',
                    portInstanceId: 'input'
                }
            },
            {
                order: 1,
                ref: {
                    nodeInstanceId: '62509613-274a-4fc0-a382-caeb7704ab9f',
                    portInstanceId: 'input'
                }
            },
            {
                order: 2,
                ref: {
                    nodeInstanceId: "d352057a-fa2d-423a-b8ad-3f9880900b9b",
                    portInstanceId: 'input'
                }
            },
            {
                order: 3,
                ref: {
                    nodeInstanceId: '146313d8-f3ad-485d-913d-72c68b2bbeb4',
                    portInstanceId: 'input'
                }
            },
            {
                order: 4,
                ref: {
                    nodeInstanceId: 'a1f2c3d4-5e6f-4789-a0b1-c2d3e4f5a6b7',
                    portInstanceId: 'input'
                }
            }
        ],
        output: []
    },
    settings: {
        units: 'mm'
    }
}

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
        }
    },
    cursors: {
        ['demo-id']: {
            x: 100,
            y: 100
        }
    },
    cameras: {}
}

const flags = {
    isEditable: true,
    // isThumbnail: true,
    hideInterface: false,
    hideScript: false
}

root.render(<StrictMode>
    <div style={{ width: '100vw', height: '100vh' }}>
        <NodesApp document={doc} templates={templates as any} solution={solution} assets={assets} presence={presence} flags={flags} />
    </div>
</StrictMode>)