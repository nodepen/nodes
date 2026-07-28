import { STYLES } from "@/constants"
import React, { useCallback } from "react"
import { MenuButton } from "../../../common"

type Props = {
    documentId: string
}

export const ShareButton = ({ documentId }: Props) => {
    const handleClick = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {

    }, [])

    const icon = (
        <svg {...STYLES.BUTTON.MEDIUM}>
            <path d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )

    return <MenuButton icon={icon} label="Share..." action={handleClick} />
}
