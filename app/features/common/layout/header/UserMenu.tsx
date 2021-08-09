import { useSessionManager } from '@/context/session'
import { auth } from 'context/session/auth/firebase'
import { signOut } from '@firebase/auth'

export const UserMenu = (): React.ReactElement => {
  const { user } = useSessionManager()

  const handleSignOut = (): void => {
    signOut(auth).then(() => {
      window.location.reload()
    })
  }

  return (
    <>
      <div>{user?.displayName}</div>
      <button onClick={handleSignOut}>Sign out</button>
    </>
  )
}
