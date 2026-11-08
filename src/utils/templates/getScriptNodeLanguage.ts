import { COMPONENTS } from '@/constants'
import type * as NodePen from '@/types'

export const getScriptNodeLanguage = (templateId: string | undefined): NodePen.ScriptNodeLanguage | null => {
    switch (templateId?.toLowerCase()) {
        case COMPONENTS.SCRIPT_CSHARP:
            return 'csharp'
        case COMPONENTS.SCRIPT_PYTHON_3:
            return 'python3'
        default:
            return null
    }
}
