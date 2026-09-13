import type * as NodePen from '@/types'

const DEFAULT_TOGGLES: Record<string, string[]> = {
    // Boolean Toggle
    'ad483f40-dc72-40dc-844d-c9e462c7d19f': ['false'],
    // Cloud Display
    '059b72b0-9bb3-4542-a805-2dcd27493164': ['fuzzy-blobs'],
    // Construct Exotic Date
    'e5ff52c5-40df-4f43-ac3b-d2418d05ae32': ['gregorian'],
    // Cross Reference
    '36947590-f0cb-4807-a8f9-9c90c9b20621': ['holistic'],
    // Cull Duplicates
    '6eaffbb2-3392-441a-8556-2dc126aa8910': ['average'],
    // Custom Preview
    '537b0419-bbc2-4ff4-bf08-afe526367b2c': ['render'],
    // Data Recorder
    '401aa475-997a-4139-991d-f980ffdcf908': ['record-data'],
    // Display Matrix
    'b6d27aa4-a61f-4d08-b76e-1105fef0e9e4': ['3-digits'],
    // Dot Display
    '6b1bd8b2-47a4-4aa6-a471-3fd91c62a486': ['lazy'],
    // Entwine
    'c9785b8e-2f30-4f90-8ee3-cca710f82402': ['flatten-inputs'],
    // Fitness Landscape
    'fe9db51e-1ac6-4298-b9dc-6acf3008c8f2': ['elevation-display', 'some-contours'],
    // Geometry Pipeline
    'b341e2e5-c4b3-49a3-b3a4-b4e6e2054516': ['include-locked-objects', 'include-hidden-objects'],
    // Graft Tree
    '87e1d9ef-088b-4d30-9dda-8a7448a17329': ['include-null-items', 'include-empty-lists'],
    // Image Sampler
    'd69a3494-785b-4beb-969b-d2373f65abfd': ['tile', 'colour'],
    // Interpolate data
    'e168ff6b-e5c0-48f1-b831-f6996bf3b459': ['linear'],
    // Legend
    'f6867cdd-2216-4451-9134-7da94bdcd5af': ['vertical-discrete'],
    // Longest List
    '8440fd1b-b6e0-4bdb-aa93-4ec295c213e9': ['repeat-last'],
    // Mesh Spray
    'edcf10e1-02a0-48a4-ae2d-70c50d903dc8': ['blend-square'],
    // Mesh | Curve
    '0db45028-8e18-4f3b-9b11-3d5ca90e81f4': ['include-overlaps'],
    // Pull Point
    '902289da-28dc-454b-98d4-b8f8aa234516': ['closest-only'],
    // RandomEx
    'a12dddbf-bb49-4ef4-aeb8-5653bc882cbd': ['integers'],
    // Read File
    '6587fcbf-e3cf-480a-b2f5-641794474194': ['per-line'],
    // Reverse Surface
    '847cf05e-e195-4bc7-b472-e05459b9792b': ['show-arrows'],
    // Shortest List
    '5a13ec19-e4e9-43da-bf65-f93025fa87ca': ['trim-end'],
    // Smooth Numbers
    '5b424e1c-d061-43cd-8c20-db84564b0502': ['two-second-delay'],
    // Transform Matrix
    '93c24899-f456-4785-84f2-314958b9347b': ['3-digits'],
    // Tree Branch
    '3a710c1e-1809-4e19-8c15-82adce31cd62': ['maintain-paths'],
    // Value Tracker
    '615367b4-c9d0-4cb7-986c-cb861226136f': ['10-seconds', 'smooth-25-ms', 'automatic-domain'],
    // var
    '08908df5-fa14-4982-9ab2-1aa0927566aa': ['unwrap-data'],
    // Vector Display
    '2a3f7078-2e25-4dd4-96f7-0efb491bd61c': ['default-size'],
}

/**
 * What a new instance of `template` records for its bespoke menu options, matching the state a
 * fresh Grasshopper instance of it is already in. `undefined` for a component with no options,
 * whose node has no configuration of this shape at all.
 */
export const getToggleDefaults = (
    template: NodePen.NodeTemplate
): NodePen.GenericConfiguration | undefined => {
    const { guid, toggles } = template

    if (!toggles || toggles.length === 0) {
        return undefined
    }

    const selected = DEFAULT_TOGGLES[guid] ?? []

    const configuration: NodePen.GenericConfiguration = { toggles: {} }

    for (const group of toggles) {
        for (const item of group.items) {
            configuration.toggles[item.value] = selected.includes(item.value)
        }
    }

    return configuration
}
