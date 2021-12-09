import { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { firebase } from 'features/common/context/session/auth/firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

const SignInPage: NextPage = () => {
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    setShowAuth(true)
  }, [])

  const uiConfig = {
    signInFlow: 'redirect',
    // TODO: Attach redirect to query params
    signInSuccessUrl: '/',
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false,
        fullLabel: 'Sign up with Email',
      },
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        fullLabel: 'Sign up with Google',
      },
      {
        provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
        fullLabel: 'Sign up with Github',
      },
    ],
  }

  return (
    <div className="w-vw h-vh flex flex-col items-center justify-center">
      <div className="w-60 h-48">
        {showAuth ? <StyledFirebaseAuth firebaseAuth={firebase.auth()} uiConfig={uiConfig} /> : null}
      </div>
    </div>
  )
}

export default SignInPage
