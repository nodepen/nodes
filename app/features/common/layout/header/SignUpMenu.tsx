import { auth } from 'context/session/auth/firebase'
import { GoogleAuthProvider, signInWithRedirect } from '@firebase/auth'

export const SignUpMenu = (): React.ReactElement => {
  const handleGoogleSignup = (): void => {
    const provider = new GoogleAuthProvider()
    signInWithRedirect(auth, provider)
  }

  return <></>

  // return (
  //   <>
  //     <button onClick={handleGoogleSignup}>
  //       <img src="auth/google-signin.png" width={200} />
  //     </button>
  //     <div>OR</div>
  //     <div>Username</div>
  //     <div>Password</div>
  //   </>
  // )
}
