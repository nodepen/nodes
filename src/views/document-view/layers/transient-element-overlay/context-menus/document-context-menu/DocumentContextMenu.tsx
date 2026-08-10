import { useStore } from "@/store"
import { MenuBody, MenuDivider } from "../../common"
import type { ContextMenu } from "../../types"
import { ExportButton, NewScriptButton, SaveCopyButton, SaveVersionButton, SettingsButton, ViewVersionsButton } from "./buttons"

type Props = {
    position: ContextMenu['position']
}

export const DocumentContextMenu = ({ position }: Props) => {
    const documentId = useStore((state) => state.document.id)

    return <MenuBody position={position}>
        <NewScriptButton documentId={documentId} />
        <SaveCopyButton documentId={documentId} />
        <ExportButton documentId={documentId} />
        <MenuDivider />
        <ViewVersionsButton documentId={documentId} />
        <SaveVersionButton documentId={documentId} />
        <MenuDivider />
        <SettingsButton documentId={documentId} />
    </MenuBody>
}
