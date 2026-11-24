import { STYLES } from "@/constants"
import { clearMenus } from "@/store/utils/clearMenus"
import React, { useCallback } from "react"
import { useCallbacks, useDispatch, useStore } from "$"
import { MenuButton } from "../../../common"

type Props = {
    documentId: string
}

export const ExportButton = ({ documentId }: Props) => {
    const { apply } = useDispatch()
    const { onClickExport } = useCallbacks()

    const handleClick = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
        onClickExport?.(useStore.getState())

        apply((state) => {
            clearMenus(state)
        })
    }, [onClickExport, apply])

    const icon = (
        <svg {...STYLES.BUTTON.MEDIUM}>
            <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 12 12 16.5m0 0 4.5-4.5M12 16.5V3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )

    return <MenuButton icon={icon} label="Export..." action={handleClick} />
}
