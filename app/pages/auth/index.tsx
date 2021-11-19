import { NextPage } from 'next'
import { firebase } from '@/features/common/context/session/auth/firebase'

const AuthPage: NextPage = () => {
  const handleGoogleSignIn = (): void => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  }

  const handleSignOut = (): void => {
    firebase.auth().signOut()
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <button onClick={handleGoogleSignIn}>Sign In</button>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  )
}

export default AuthPage
