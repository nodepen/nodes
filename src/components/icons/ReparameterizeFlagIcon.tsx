import { STYLES } from "@/constants"

type IconProps = {
  position?: { x: number, y: number }
}

export const ReparameterizeFlagIcon = ({ position }: IconProps) => {
  const { x, y } = position ?? {}

  return (
    <svg x={x} y={y} {...STYLES.BUTTON.SMALL} width={14} height={14}>
      <circle cx="12" cy="12" r="7.5" />
    </svg>
  )
}
