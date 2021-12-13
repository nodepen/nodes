import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { firebase } from 'features/common/context/session/auth/firebase'
import { AuthLayout } from './layout'
import { ValidationErrorMessage, ZigZagDivider } from './components'
import Link from 'next/link'

const SignInForm = (): React.ReactElement => {
  const router = useRouter()

  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const [signInErrors, setSignInErrors] = useState<string[]>([])

  const handleFirstPartySignIn = (): void => {
    setSignInErrors([])

    if (!emailInputRef.current || !passwordInputRef.current) {
      setSignInErrors(['Failed to sign in.'])
      return
    }

    const emailValue = emailInputRef.current.value
    const passwordValue = passwordInputRef.current.value

    if (!emailValue || !passwordValue) {
      setSignInErrors(['Please enter your email and password.'])
      return
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(emailValue, passwordValue)
      .then(() => {
        router.push('/')
      })
      .catch((err) => {
        console.error(err)
        setSignInErrors(['Incorrect email or password.'])
      })
  }

  const handleThirdPartySignIn = (
    provider: firebase.auth.GoogleAuthProvider | firebase.auth.GithubAuthProvider
  ): void => {
    firebase.auth().signInWithRedirect(provider)
  }

  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetRequested, setResetRequested] = useState(false)

  const handleResetPassword = (): void => {
    if (!emailInputRef.current) {
      return
    }

    setSignInErrors([])
    setResetRequested(true)

    firebase
      .auth()
      .sendPasswordResetEmail(emailInputRef.current.value)
      .then(() => {
        setSignInErrors(['Password reset message sent!'])
      })
      .catch(() => {
        setSignInErrors(['Failed to send reset message.'])
      })
      .finally(() => {
        setResetRequested(false)
      })
  }

  return (
    <AuthLayout>
      <div className="w-full p-4 flex flex-col" style={{ maxWidth: 250 }}>
        <div className="p-2 bg-pale rounded-md flex flex-col items-center">
          <h1 className="text-dark text-2xl font-semibold">{showForgotPassword ? 'Reset Password' : 'Sign In'}</h1>
          <div className="w-full mb-2 flex items-center justify-center overflow-visible">
            <ZigZagDivider />
          </div>
          <>
            {signInErrors.map((msg, i) => (
              <ValidationErrorMessage key={`signin-validation-error-${i}`} message={msg} />
            ))}
          </>
          <div className="w-full h-10 pl-2 pr-2 rounded-md bg-white relative overflow-hidden">
            <div className="w-10 h-10 absolute left-0 top-0 z-10">
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="#333"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <input
              className="w-full h-full pl-10 pr-3 absolute left-0 top-0 z-0"
              ref={emailInputRef}
              placeholder="Email"
            />
          </div>
          {showForgotPassword ? null : (
            <div className="w-full h-10 mt-2 pl-2 pr-2 rounded-md bg-white relative overflow-hidden">
              <div className="w-10 h-10 absolute left-0 top-0 z-10">
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="#333"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      vectorEffect="non-scaling-stroke"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <input
                className="w-full h-full pl-10 pr-3 absolute left-0 top-0 z-0"
                ref={passwordInputRef}
                placeholder="Password"
                type="password"
              />
            </div>
          )}
          <button
            disabled={resetRequested}
            onClick={showForgotPassword ? handleResetPassword : handleFirstPartySignIn}
            className={`w-full h-10 mt-2 mb-2 pl-2 pr-2 flex items-center justify-center rounded-md bg-green hover:bg-swampgreen`}
          >
            <p className={`font-semibold text-darkgreen`}>{showForgotPassword ? 'Reset Password' : 'Sign In!'}</p>
          </button>
          {showForgotPassword ? null : (
            <>
              <div className="w-full flex items-center">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="leading-6 flex-grow text-sm text-center rounded-md pl-2 pr-2 text-dark hover:bg-green"
                >
                  Forgot Password?
                </button>
                <Link href="/signup">
                  <a className="leading-6 flex-grow text-sm text-center rounded-md pl-2 pr-2 text-dark hover:bg-green">
                    Sign Up!
                  </a>
                </Link>
              </div>
              <div className="w-full mt-1 mb-1 flex items-center justify-center overflow-visible">
                <ZigZagDivider />
              </div>
              <button
                className="w-full mb-1"
                style={{ paddingLeft: 3, paddingRight: 3, height: 42 }}
                onClick={() => handleThirdPartySignIn(new firebase.auth.GoogleAuthProvider())}
              >
                <div className="w-full h-full pr-1 rounded-sm flex items-center " style={{ background: '#4285F4' }}>
                  <img src="/auth/google-auth-logo.svg" alt="Google logo" style={{ transform: 'translateX(-1px)' }} />
                  <div
                    className="h-full flex-grow flex items-center justify-center text-white font-medium font-roboto"
                    style={{ fontSize: 15 }}
                  >
                    Sign in with Google
                  </div>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  )
}

export default React.memo(SignInForm)
