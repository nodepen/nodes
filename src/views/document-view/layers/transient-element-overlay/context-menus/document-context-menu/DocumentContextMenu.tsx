import { useStore } from "@/store"
import { MenuBody, MenuDivider } from "../../common"
import type { ContextMenu } from "../../types"
import { DuplicateDocumentButton, ExportModelButton, ExportScriptButton, NewDocumentButton, SettingsButton, ShareButton } from "./buttons"

type Props = {
    position: ContextMenu['position']
}

export const DocumentContextMenu = ({ position }: Props) => {
    const documentId = useStore((state) => state.document.id)

    return <MenuBody position={position}>
        <NewDocumentButton documentId={documentId} />
        <DuplicateDocumentButton documentId={documentId} />
        <MenuDivider />
        <ShareButton documentId={documentId} />
        <MenuDivider />
        <ExportScriptButton documentId={documentId} />
        <ExportModelButton documentId={documentId} />
        <MenuDivider />
        <SettingsButton documentId={documentId} />
    </MenuBody>
}