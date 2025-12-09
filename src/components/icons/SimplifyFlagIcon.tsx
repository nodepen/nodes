import { STYLES } from "@/constants"

type IconProps = {
  position?: { x: number, y: number }
}

export const SimplifyFlagIcon = ({ position }: IconProps) => {
  const { x, y } = position ?? {}

  return (
    <svg x={x} y={y} {...STYLES.BUTTON.SMALL} width={14} height={14}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M 18 12 H 12 L 6 6 M 12 12 L 6 18" />
    </svg>
  )
}