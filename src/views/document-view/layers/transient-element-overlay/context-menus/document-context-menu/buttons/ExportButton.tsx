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
            <path d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )

    return <MenuButton icon={icon} label="Export..." action={handleClick} />
}
