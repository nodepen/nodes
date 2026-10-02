import { STYLES } from "@/constants"
import { clearMenus } from "@/store/utils/clearMenus"
import React, { useCallback } from "react"
import { useCallbacks, useDispatch, useStore } from "$"
import { MenuButton } from "../../../common"

type Props = {
    documentId: string
}

export const ImportButton = ({ documentId }: Props) => {
    const { apply } = useDispatch()
    const { onClickImport } = useCallbacks()

    const handleClick = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
        onClickImport?.(useStore.getState())

        apply((state) => {
            clearMenus(state)
        })
    }, [onClickImport, apply])

    const icon = (
        <svg {...STYLES.BUTTON.MEDIUM}>
            <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 7.5m0 0L7.5 12m4.5-4.5v13.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )

    return <MenuButton icon={icon} label="Import..." action={handleClick} />
}
