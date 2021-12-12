import React, { useRef, useState } from 'react'
import { firebase } from 'features/common/context/session/auth/firebase'
import { useSessionManager } from '@/features/common/context/session'
import { useRouter } from 'next/router'
import { gql, useApolloClient } from '@apollo/client'
import { ValidationErrorMessage } from './components'

const SignUpForm = (): React.ReactElement => {
  const router = useRouter()
  const client = useApolloClient()

  const { user } = useSessionManager()

  const [doBounce, setDoBounce] = useState(false)

  const handleToggleBounce = (): void => {
    setDoBounce(true)
    setTimeout(() => {
      setDoBounce(false)
    }, 250)
  }

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

  const handleUsernameInputChange = (value: string): void => {
    if (debounceUsernameValidation.current) {
      clearTimeout(debounceUsernameValidation.current)
    }

    handleToggleBounce()

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

  const handleFirstPartyAuth = (): void => {
    if (!username || !email || !password) {
      return
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        if (!res.user) {
          throw new Error('')
        }

        return res.user.updateProfile({ displayName: username })
      })
      .then(() => {
        router.push('/')
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const handleThirdPartyAuth = async (
    provider: firebase.auth.GoogleAuthProvider | firebase.auth.GithubAuthProvider
  ): Promise<void> => {
    if (!user) {
      console.error('No user!')
      return
    }

    if (usernameValidationErrors.length !== 0) {
      console.log('Failed validation!')
      return
    }

    const preflight = validateUsername(username)

    const isAvailable = await verifyUsernameAvailable(username)

    if (!isAvailable) {
      preflight.push('Username not available.')
    }

    if (preflight.length !== 0) {
      console.log('Failed preflight validation!')
      return
    }

    if (!user.isAnonymous) {
      // Someone is currently signed in. Create and link a new anonymous account.

      let anon: typeof user

      firebase
        .auth()
        .signInAnonymously()
        .then((cred) => {
          if (!cred.user) {
            throw new Error('Failed to generate temporary anonymous user.')
          }

          anon = cred.user

          return anon.updateProfile({ displayName: username })
        })
        .then(() => {
          anon.linkWithRedirect(provider)
        })
    } else {
      // Link existing anonymous account.

      user.updateProfile({ displayName: username }).then(() => {
        user.linkWithRedirect(provider)
      })
    }
  }

  const [showEmailAuth, setShowEmailAuth] = useState(false)

  const [email, setEmail] = useState<string>('')

  const handleEmailChange = (value: string): void => {
    handleToggleBounce()

    setEmail(value)
  }

  const [password, setPassword] = useState<string>('')
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>()

  const handlePasswordChange = (value: string): void => {
    handleToggleBounce()

    setPasswordIsValid(true)

    setPassword(value)
  }

  const handlePasswordValidation = (value: string): void => {
    const isValid = (v: string): boolean => {
      return !!v.match(/(?=.*[0-9a-zA-Z]).{6,}/)
    }

    setPasswordIsValid(isValid(value))
  }

  return (
    <div className="w-vw h-vh relative overflow-hidden">
      <div className={` w-vw h-vh absolute left-0 top-0 z-0 bg-green`}>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className={`${doBounce ? 'do-bounce' : ''} w-128 h-128 rounded-full bg-pale`} />
        </div>
      </div>
      <div className="w-vw h-vh absolute left-0 top-0 z-10">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="w-full p-4 flex flex-col" style={{ maxWidth: 250 }}>
            <div className="p-2 bg-pale rounded-md flex flex-col items-center">
              <h1 className="text-dark text-2xl font-semibold">Sign Up</h1>
              <div className="w-full mb-2 flex items-center justify-center overflow-visible">
                {Array(7)
                  .fill('')
                  .map((_, i) => (
                    <svg
                      key={`title-underline-${i}`}
                      width="25"
                      height="25"
                      viewBox="0 -2.5 10 10"
                      className="overflow-visible"
                    >
                      <polyline
                        points="0,2.5 2.5,1 5,2.5 7.5,4 10,2.5"
                        fill="none"
                        stroke="#98E2C6"
                        strokeWidth="3px"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  ))}
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
                className="w-full pt-4 flex flex-col items-start overflow-hidden"
                style={{
                  maxHeight: showAuthOptions && usernameValidationErrors.length === 0 ? 400 : 0,
                  transition: 'max-height',
                  transitionDuration: '300ms',
                  transitionTimingFunction: 'ease-out',
                }}
              >
                {showEmailAuth ? (
                  <>
                    <div className="w-full h-10 mb-2 pl-2 pr-2 rounded-md bg-white relative overflow-hidden">
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
                    <div className="w-full h-10 mb-2 pl-2 pr-2 rounded-md bg-white relative overflow-hidden">
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
                    <button className="w-full h-10 pl-2 pr-2 flex items-center justify-center rounded-md bg-green hover:bg-swampgreen">
                      <p className="font-semibold text-darkgreen">Sign Up!</p>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="w-full mb-1"
                      style={{ paddingLeft: 3, paddingRight: 3, height: 42 }}
                      onClick={() => handleThirdPartyAuth(new firebase.auth.GoogleAuthProvider())}
                    >
                      <div
                        className="w-full h-full pr-1 rounded-sm flex items-center "
                        style={{ background: '#4285F4' }}
                      >
                        <img src="/auth/google-auth-logo.svg" style={{ transform: 'translateX(-1px)' }} />
                        <div
                          className="h-full flex-grow flex items-center justify-center text-white font-medium font-roboto"
                          style={{ fontSize: 15 }}
                        >
                          Sign up with Google
                        </div>
                      </div>
                    </button>
                    <button
                      className="w-full h-10"
                      style={{ paddingLeft: 3, paddingRight: 3, height: 42 }}
                      onClick={() => setShowEmailAuth(true)}
                    >
                      <div className="w-full h-full flex items-center rounded-sm hover:bg-green">
                        <div className="h-10 flex items-center justify-center" style={{ width: 44 }}>
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
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
                        <div className="h-full flex-grow flex items-center justify-center font-medium text-dark text-md">
                          Sign up with Email
                        </div>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes bounce {
          0% {
            transform: translateY(0px);
          }
          40% {
            transform: translateY(8px);
          }
          80% {
            transform: translateY(-2px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .do-bounce {
          animation-name: bounce;
          animation-duration: 250ms;
          animation-timing-function: ease-out;
        }
      `}</style>
    </div>
  )
}

export default React.memo(SignUpForm)
