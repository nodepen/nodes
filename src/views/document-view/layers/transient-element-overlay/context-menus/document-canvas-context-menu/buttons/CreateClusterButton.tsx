import { STYLES } from "@/constants"
import { MenuButton } from "../../../common"

type Props = {
    onClick: () => void
}

export const CreateClusterButton = ({ onClick }: Props) => {
    const icon = (
        <svg {...STYLES.BUTTON.MEDIUM}>
            <path d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )

    return <MenuButton icon={icon} label="Create cluster" action={onClick} />
}
