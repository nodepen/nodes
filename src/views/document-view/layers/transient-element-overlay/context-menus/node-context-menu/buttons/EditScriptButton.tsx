import { STYLES } from "@/constants"
import { useDispatch, useStore } from "@/store"
import { MenuButton } from "../../../common"

type ButtonProps = {
    nodeInstanceId: string
}

export const EditScriptButton = ({ nodeInstanceId }: ButtonProps) => {
    const { clearInterface } = useDispatch()

    const handleEditScript = () => {
        clearInterface()

        const state = useStore.getState()
        state.callbacks.onOpenScriptEditor?.(state, { nodeInstanceId })
    }

    const icon = (
        <svg {...STYLES.BUTTON.SMALL} strokeWidth={2} width={16} height={16}>
            <path d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )

    return <MenuButton icon={icon} label="Edit script" action={handleEditScript} />
}
