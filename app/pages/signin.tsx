import { NextPage } from 'next'
import { firebase } from 'features/common/context/session/auth'
import { useEffect } from 'react'
import { useSessionManager } from '@/features/common/context/session'
import { useRouter } from 'next/router'

const SignInPage: NextPage = () => {
  const router = useRouter()

  const { user } = useSessionManager()

  useEffect(() => {
    if (!user) {
      return
    }

    // e-mail auth
    firebase
      .auth()
      .createUserWithEmailAndPassword('em', 'pw')
      .then((u) => {
        if (!u.user) {
          return
        }
        // update user displayname
        return u.user.updateProfile({ displayName: 'from-page' })
      })
      .then(() => {
        // make request to api to create user record

        // redirect to home
        router.push('/')
      })

    // provider auth
    const provider = new firebase.auth.GoogleAuthProvider()

    user.updateProfile({ displayName: 'from-page' }).then(() => {
      user.linkWithRedirect(provider)
    })
  }, [])

  return (
    <div className="w-vw h-vh flex flex-col items-center justify-center">
      <div className="w-60 h-48"></div>
    </div>
  )
}

export default SignInPage
