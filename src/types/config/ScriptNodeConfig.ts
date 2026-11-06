export type ScriptNodeConfig = {
    source?: string
    standardOutput?: boolean
    // py
    marshInputs?: boolean
    marshOutputs?: boolean
    marshGuids?: boolean
}

export type ScriptNodeLanguage = 'csharp' | 'python3'
