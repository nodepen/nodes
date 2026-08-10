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
            <path d="M17.593 3.322c1.1.128 2.192.297 3.223.55.34.083.647.324.647.706v14.36a.75.75 0 0 1-1.075.676L12 16.28l-8.388 4.334A.75.75 0 0 1 2.537 19.94V5.578c0-.382.306-.622.646-.706a48.11 48.11 0 0 1 3.334-.55m9.076 0a48.11 48.11 0 0 0-9.076 0" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )

    return <MenuButton icon={icon} label="Save version..." action={handleClick} />
}
