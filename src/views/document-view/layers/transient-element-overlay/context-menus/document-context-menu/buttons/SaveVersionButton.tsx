import { STYLES } from "@/constants"
import { clearMenus } from "@/store/utils/clearMenus"
import React, { useCallback } from "react"
import { useCallbacks, useDispatch, useStore } from "$"
import { MenuButton } from "../../../common"

type Props = {
    documentId: string
}

export const SaveVersionButton = ({ documentId }: Props) => {
    const { apply } = useDispatch()
    const { onClickSaveVersion } = useCallbacks()

    const handleClick = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
        onClickSaveVersion?.(useStore.getState())

        apply((state) => {
            clearMenus(state)
        })
    }, [onClickSaveVersion, apply])

    const icon = (
        <svg {...STYLES.BUTTON.MEDIUM}>
            <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )

    return <MenuButton icon={icon} label="Save version..." action={handleClick} />
}
