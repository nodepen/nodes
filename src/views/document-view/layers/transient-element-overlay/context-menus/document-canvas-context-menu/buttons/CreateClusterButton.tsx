import { STYLES } from "@/constants"
import { clearMenus } from "@/store/utils/clearMenus"
import { expireSolution } from "@/store/utils/expireSolution"
import { addDocumentNode } from "@/store/utils/documentNodes"
import { createEmptyCluster } from "@/utils/clusters"
import { newGuid } from "@/utils/common"
import React, { useCallback } from "react"
import { useDispatch } from "$"
import { MenuButton } from "../../../common"

type Props = {
    onClick: () => void
}

export const CreateClusterButton = ({ onClick }: Props) => {
    const { apply } = useDispatch()

    const icon = (
        <svg {...STYLES.BUTTON.MEDIUM}>
            <path d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )

    return <MenuButton icon={icon} label="Create cluster" action={onClick} />
}
