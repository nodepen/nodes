import React, { useEffect, useRef, useState } from 'react'
import nookies from 'nookies'
import { firebase } from 'features/common/context/session/auth/firebase'
import { useRouter } from 'next/router'
import { useAuthRedirectResult } from './hooks'
import { gql, useApolloClient } from '@apollo/client'
import { ValidationErrorMessage, ZigZagDivider } from './components'
import { AuthLayout } from './layout'
import Link from 'next/link'

const SignUpForm = (): React.ReactElement => {
  const router = useRouter()
  const client = useApolloClient()

  useAuthRedirectResult('/')

  const [username, setUsername] = useState<string>('')
  const [usernameValidationErrors, setUsernameValidationErrors] = useState<string[]>([])

  const debounceUsernameValidation = useRef<ReturnType<typeof setTimeout>>()

  const [showAuthOptions, setShowAuthOptions] = useState(false)

  const validateUsername = (value: string): string[] => {
    const validationErrors: string[] = []

    if (value.length < 3) {
      validationErrors.push('Must be at least 3 characters.')
    }

    if (value.length > 32) {
      validationErrors.push('Must be fewer than 32 characters.')
    }

    if (!value.match(/^[A-Za-z]+$/)) {
      validationErrors.push('May only contain letters (A-Z) without spaces.')
    }

    return validationErrors
  }

  const verifyUsernameAvailable = async (value: string): Promise<boolean> => {
    const res = await client.query({
      query: gql`
        query IsUsernameAvailable($username: String!) {
          publicUserByUsername(username: $username) {
            username
          }
        }
      `,
      variables: {
        username: value,
      },
    })

    const userExists = !!res.data.publicUserByUsername

    return !userExists
  }

  useEffect(() => {
    verifyUsernameAvailable('')
  }, [])

  const handleUsernameInputChange = (value: string): void => {
    if (debounceUsernameValidation.current) {
      clearTimeout(debounceUsernameValidation.current)
    }

    setUsername(value)

    debounceUsernameValidation.current = setTimeout(() => {
      verifyUsernameAvailable(value).then((isAvailable) => {
        const validationErrors = validateUsername(value)

        if (!isAvailable) {
          validationErrors.push('Username not available.')
        }

        setUsernameValidationErrors(validationErrors)

        if (validationErrors.length === 0) {
          setShowAuthOptions(true)
        }
      })
    }, 250)
  }

  const [showEmailAuth, setShowEmailAuth] = useState(false)

  const [email, setEmail] = useState<string>('')
  const [emailValidationErrors, setEmailValidationErrors] = useState<string[]>([])

  const debounceEmailValidation = useRef<ReturnType<typeof setTimeout>>()

  const validateEmail = (value: string): string[] => {
    const validationErrors: string[] = []

    if (!value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      validationErrors.push('Please provide a valid e-mail address.')
    }

    return validationErrors
  }

  const handleEmailChange = (value: string): void => {
    if (debounceEmailValidation.current) {
      clearTimeout(debounceEmailValidation.current)
    }

    setEmail(value)

    debounceEmailValidation.current = setTimeout(() => {
      setEmailValidationErrors(validateEmail(value))
    }, 250)
  }

  const [password, setPassword] = useState<string>('')
  const [passwordValidationErrors, setPasswordValidationErrors] = useState<string[]>([])

  const debouncePasswordValidation = useRef<ReturnType<typeof setTimeout>>()

  const validatePassword = (value: string): string[] => {
    const validationErrors: string[] = []

    if (value.length < 6) {
      validationErrors.push('Must be at least 6 characters long.')
    }

    return validationErrors
  }

  const handlePasswordChange = (value: string): void => {
    if (debouncePasswordValidation.current) {
      clearTimeout(debouncePasswordValidation.current)
    }

    setPassword(value)

    debouncePasswordValidation.current = setTimeout(() => {
      setPasswordValidationErrors(validatePassword(value))
    }, 250)
  }

  const handlePreflight = async (): Promise<string[]> => {
    const preflightErrors: string[] = []

    const isAvailable = await verifyUsernameAvailable(username)

    if (!isAvailable) {
      preflightErrors.push('Username not available.')
    }

    const usernameErrors = validateUsername(username)
    setUsernameValidationErrors(usernameErrors)

    const emailErrors = validateEmail(email)
    setEmailValidationErrors(emailErrors)

    const passwordErrors = validatePassword(password)
    setPasswordValidationErrors(passwordErrors)

    preflightErrors.push(...usernameErrors, ...emailErrors, ...passwordErrors)

    return preflightErrors
  }

  const [signUpInProgress, setSignUpInProgress] = useState(false)

  const handleFirstPartyAuth = async (): Promise<void> => {
    if (!username || !email || !password) {
      return
    }

    const preflight = await handlePreflight()

    if (preflight.length !== 0) {
      console.error('Failed preflight validation!')
      return
    }

    if (signUpInProgress) {
      return
    }

    setSignUpInProgress(true)

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        if (!res.user) {
          throw new Error('')
        }

        const updateProfileResult = res.user.updateProfile({ displayName: username })
        const getTokenResult = res.user.getIdToken()

        return Promise.all([getTokenResult, updateProfileResult])
      })
      .then(([token]) => {
        nookies.set(undefined, 'token', token, { path: '/' })
        router.push('/')
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const handleThirdPartyAuth = async (
    provider: firebase.auth.GoogleAuthProvider | firebase.auth.GithubAuthProvider
  ): Promise<void> => {
    if (signUpInProgress) {
      return
    }

    const isAvailable = await verifyUsernameAvailable(username)

    if (!isAvailable) {
      setUsernameValidationErrors(['Username not available.'])
      return
    }

    setSignUpInProgress(true)

    const createThirdPartyUser = async (): Promise<void> => {
      const auth = firebase.auth()

      const cred = await auth.signInAnonymously()

      if (!cred.user) {
        return
      }

      await cred.user.updateProfile({ displayName: username })

      cred.user.linkWithRedirect(provider)
    }

    createThirdPartyUser()
      .then(() => {
        // Do nothing
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const signUpReady =
    !signUpInProgress &&
    [...usernameValidationErrors, ...emailValidationErrors, ...passwordValidationErrors].length === 0

  return (
    <AuthLayout>
      <div className="w-full p-4 flex flex-col" style={{ maxWidth: 250 }}>
        <div className="p-2 bg-pale rounded-md flex flex-col items-center">
          <h1 className="text-dark text-2xl font-semibold">Sign Up</h1>
          <div className="w-full mb-2 flex items-center justify-center overflow-visible">
            <ZigZagDivider />
          </div>
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
            <input
              className="w-full h-full pl-10 pr-3 absolute left-0 top-0 z-0"
              onChange={(e) => handleUsernameInputChange(e.target.value)}
              placeholder="Username"
            />
          </div>
          <>
            {usernameValidationErrors.map((msg, i) => (
              <ValidationErrorMessage key={`username-validation-error-${i}`} message={msg} />
            ))}
          </>
          <div
            className="w-full flex flex-col items-start overflow-hidden"
            style={{
              maxHeight: showAuthOptions && usernameValidationErrors.length === 0 ? 400 : 0,
              transition: 'max-height',
              transitionDuration: '300ms',
              transitionTimingFunction: 'ease-out',
            }}
          >
            {showEmailAuth ? (
              <>
                <div className="w-full h-10 mt-4 pl-2 pr-2 rounded-md bg-white relative overflow-hidden">
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
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="Email"
                  />
                </div>
                <>
                  {emailValidationErrors.map((msg, i) => (
                    <ValidationErrorMessage key={`email-validation-error-${i}`} message={msg} />
                  ))}
                </>
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
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="Password"
                    type="password"
                  />
                </div>
                <>
                  {passwordValidationErrors.map((msg, i) => (
                    <ValidationErrorMessage key={`password-validation-error-${i}`} message={msg} />
                  ))}
                </>
                <button
                  disabled={!signUpReady}
                  onClick={handleFirstPartyAuth}
                  className={`${
                    signUpReady ? 'hover:bg-swampgreen' : ''
                  } w-full h-10 mt-2 pl-2 pr-2 flex items-center justify-center rounded-md bg-green`}
                >
                  <p className={`${signUpReady ? 'text-darkgreen' : 'text-swampgreen'} font-semibold`}>Sign Up!</p>
                </button>
              </>
            ) : (
              <>
                <button className="w-full mt-2 mb-2 h-10" onClick={() => setShowEmailAuth(true)}>
                  <div className="w-full h-full flex items-center rounded-md bg-green hover:bg-swampgreen">
                    <div className="h-10 w-10 flex items-center justify-center">
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
                    <div className="h-full pb-1 flex-grow flex items-center justify-start font-medium text-dark text-md">
                      Sign up with Email
                    </div>
                  </div>
                </button>
                <div className="w-full text-xs pl-2 mb-1 text-center font-semibold text-swampgreen">
                  By signing up, you agree to NodePen&apos;s{' '}
                  <Link href="/legal/terms-and-conditions">
                    <a className="underline hover:text-darkgreen">Terms of Service</a>
                  </Link>{' '}
                  and{' '}
                  <Link href="/legal/privacy-policy">
                    <a className="underline hover:text-darkgreen">Privacy Policy</a>
                  </Link>
                  .
                </div>
                <div className="w-full mb-2 flex items-center justify-center overflow-visible">
                  <ZigZagDivider />
                </div>
                <button
                  className="w-full mt-1 mb-1"
                  style={{ paddingLeft: 3, paddingRight: 3, height: 42 }}
                  onClick={() => handleThirdPartyAuth(new firebase.auth.GoogleAuthProvider())}
                >
                  <div className="w-full h-full pr-1 rounded-sm flex items-center " style={{ background: '#4285F4' }}>
                    <img src="/auth/google-auth-logo.svg" alt="Google logo" style={{ transform: 'translateX(-1px)' }} />
                    <div
                      className="h-full flex-grow flex items-center justify-center text-white font-medium font-roboto"
                      style={{ fontSize: 15 }}
                    >
                      Sign up with Google
                    </div>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default React.memo(SignUpForm)
