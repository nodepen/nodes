type IconProps = {
  width?: number
  height?: number
  fill?: string
}

/**
 * A simple four-point sparkle. `kind` on a presence session is presentational only — an agent
 * acts with the token of the person who asked for it — but a session reading as just another
 * person in the roster is the thing most likely to confuse someone, so anywhere a session is
 * drawn should use this in place of the usual initial for `kind: 'agent'`.
 */
export const AgentSparkleIcon = ({ width = 14, height = 14, fill = 'currentColor' }: IconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <path d="M12 2 L14.2 9.3 L21.5 12 L14.2 14.7 L12 22 L9.8 14.7 L2.5 12 L9.8 9.3 Z" />
    </svg>
  )
}
