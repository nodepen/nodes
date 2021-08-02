import { firebase } from 'context/session/auth/firebase'

export const SignUpMenu = (): React.ReactElement => {
  const handleGoogleSignup = (): void => {
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase.auth().signInWithRedirect(provider)
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
