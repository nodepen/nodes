import { NextPage } from 'next'
import { firebase } from 'features/common/context/session/auth/firebase'
import { useRef, useState } from 'react'
import { useSessionManager } from '@/features/common/context/session'
import { useRouter } from 'next/router'
import { ApolloContext } from '@/features/common/context/apollo'
import { gql, useApolloClient } from '@apollo/client'

const SignUpPage: NextPage = () => {
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
  const [usernameValid, setUsernameValid] = useState<boolean>()
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>()

  const debounceUsernameValidation = useRef<ReturnType<typeof setTimeout>>()
  const [showUsernameValidation, setShowUsernameValidation] = useState(false)

  const [showAuthOptions, setShowAuthOptions] = useState(false)

  const handleUsernameInputChange = (value: string): void => {
    if (debounceUsernameValidation.current) {
      clearTimeout(debounceUsernameValidation.current)
    }

    handleToggleBounce()

    setUsername(value)

    const isValid = (v: string): boolean => {
      return !!v.match(/^[a-zA-Z]{3,32}$/)
    }

    debounceUsernameValidation.current = setTimeout(() => {
      client
        .query({
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
        .then((res) => {
          const userExists = !!res.data.publicUserByUsername
          setUsernameAvailable(!userExists)
          setUsernameValid(isValid(value))
          setShowUsernameValidation(true)
          setShowAuthOptions(true)
        })
    }, 250)
  }

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

  const handleThirdPartyAuth = (
    provider: firebase.auth.GoogleAuthProvider | firebase.auth.GithubAuthProvider
  ): void => {
    if (!user || !user.isAnonymous) {
      return
    }

    if (!username) {
      return
    }

    user.updateProfile({ displayName: username }).then(() => {
      user.linkWithRedirect(provider)
    })
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
              {showUsernameValidation ? (
                <>
                  {usernameValid ? null : (
                    <p>Usernames must be between 6-32 characters and may only contain letters.</p>
                  )}
                  {usernameAvailable === false ? <p>Username is not available :(</p> : null}
                </>
              ) : null}
              <div
                className="w-full flex flex-col items-start overflow-hidden"
                style={{
                  maxHeight: showAuthOptions && usernameValid && usernameAvailable ? 400 : 0,
                  transition: 'max-height',
                  transitionDuration: '300ms',
                  transitionTimingFunction: 'ease-out',
                }}
              >
                <h3 className="ml-3 pb-1 text-dark text-sm font-semibold">EMAIL</h3>
                <input
                  value={email}
                  className="w-full h-10 rounded-md pl-3 pr-3 mb-4"
                  onChange={(e) => handleEmailChange(e.target.value)}
                ></input>
                <h3 className="ml-3 pb-1 text-dark text-sm font-semibold">PASSWORD</h3>
                <input
                  type="password"
                  value={password}
                  className="w-full h-10 rounded-md pl-3 pr-3 mb-4"
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={(e) => handlePasswordValidation(e.target.value)}
                ></input>
                {passwordIsValid === false ? <p>Passwords must contain at least 6 characters.</p> : null}
                <img className="mb-1" src="/auth/google-signin.png" />
                <img src="/auth/google-signin.png" />
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

const SignUpPageWrapper: NextPage = () => {
  const { token } = useSessionManager()

  return (
    <ApolloContext token={token}>
      <SignUpPage />
    </ApolloContext>
  )
}

export default SignUpPageWrapper
