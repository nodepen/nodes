import { STYLES } from "@/constants"
import { clearMenus } from "@/store/utils/clearMenus"
import React, { useCallback } from "react"
import { useCallbacks, useDispatch, useStore } from "$"
import { MenuButton } from "../../../common"

type Props = {
    documentId: string
}

export const ViewVersionsButton = ({ documentId }: Props) => {
    const { apply } = useDispatch()
    const { onClickViewVersions } = useCallbacks()

    const handleClick = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
        onClickViewVersions?.(useStore.getState())

        apply((state) => {
            clearMenus(state)
        })
    }, [onClickViewVersions, apply])

    const icon = (
        <svg {...STYLES.BUTTON.MEDIUM}>
            <path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )

    return <MenuButton icon={icon} label="View versions" action={handleClick} />
}
