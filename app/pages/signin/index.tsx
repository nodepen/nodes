import { useRef } from 'react'
import { NextPage } from 'next'
import nookies from 'nookies'
import { useRouter } from 'next/router'
import { firebase } from '@/features/common/context/session/auth/firebase'

const SignInPage: NextPage = () => {
  const router = useRouter()

  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const handleSignIn = (): void => {
    const email = emailInputRef.current?.value
    const password = passwordInputRef.current?.value

    if (!email || !password) {
      console.log(email)
      console.log(password)
      return
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        router.push('/gh')
      })
  }

  const handleSignOut = (): void => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        nookies.destroy(undefined, 'token')
        router.push('/')
      })
  }

  return (
    <div className="w-vw h-vh flex flex-col items-center justify-center">
      <input className="mb-2" ref={emailInputRef} placeholder="email"></input>
      <input className="mb-2" ref={passwordInputRef} placeholder="password" type="password"></input>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  )
}

export default SignInPage
