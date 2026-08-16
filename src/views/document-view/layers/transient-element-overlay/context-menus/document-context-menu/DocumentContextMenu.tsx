import { useStore } from "@/store"
import { MenuBody, MenuDivider } from "../../common"
import type { ContextMenu } from "../../types"
import { ExportButton, NewScriptButton, SaveCopyButton, SaveVersionButton, SettingsButton, ViewVersionsButton } from "./buttons"
import { useFeatureFlag } from "@/hooks/useFeatureFlag"
import { useIsEditable } from "@/hooks/useIsEditable"

type Props = {
    position: ContextMenu['position']
}

export const DocumentContextMenu = ({ position }: Props) => {
    const documentId = useStore((state) => state.document.id)

    const isEditable = useIsEditable()

    const enableFileSave = useFeatureFlag('enableFileSave')
    const enableFileSaveCopy = useFeatureFlag('enableFileSaveCopy')
    const enableFileExport = useFeatureFlag('enableFileExport')
    const enableVersions = useFeatureFlag('enableDocumentVersions')

    return <MenuBody position={position}>
        {enableFileSave && <NewScriptButton documentId={documentId} />}
        {enableFileSaveCopy && <SaveCopyButton documentId={documentId} />}
        {enableFileExport && <ExportButton documentId={documentId} />}
        {enableVersions && <MenuDivider />}
        {enableVersions && <ViewVersionsButton documentId={documentId} />}
        {enableVersions && <SaveVersionButton documentId={documentId} />}
        {isEditable && <MenuDivider />}
        {isEditable && <SettingsButton documentId={documentId} />}
    </MenuBody>
}
