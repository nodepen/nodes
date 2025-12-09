import { STYLES } from "@/constants"

type IconProps = {
  position?: { x: number, y: number }
}

export const GraftFlagIcon = ({ position }: IconProps) => {
  const { x, y } = position ?? {}

  return (
    <svg x={x} y={y} {...STYLES.BUTTON.SMALL} width={14} height={14}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
    </svg>
  )
}