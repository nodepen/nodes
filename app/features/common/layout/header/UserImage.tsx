import { useSessionManager } from 'context/session'

export const UserImage = (): React.ReactElement => {
  const { user } = useSessionManager()

  return (
    <img
      src={user?.photoURL ?? undefined}
      style={{ filter: 'grayscale(1)', WebkitFilter: 'grayscale(1)', width: '100%', height: '100%' }}
    />
  )
}
