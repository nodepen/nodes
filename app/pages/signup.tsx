import { NextPage } from 'next'
import { firebase } from 'features/common/context/session/auth/firebase'
import { useState } from 'react'
import { useSessionManager } from '@/features/common/context/session'
import { useRouter } from 'next/router'

const SignUpPage: NextPage = () => {
  const router = useRouter()

  const { user } = useSessionManager()

  const [username, setUsername] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()

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
    <div className="w-vw h-vh flex flex-col items-center justify-center">
      <input value={username} placeholder="username" onChange={(e) => setUsername(e.target.value)} />
      <input value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <input value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleFirstPartyAuth}>Sign Up</button>
    </div>
  )
}

export default SignUpPage
