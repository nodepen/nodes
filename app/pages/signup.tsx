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

  // return (
  //   <div className="w-vw h-vh flex flex-col items-center justify-center">
  //     <input value={username} placeholder="username" onChange={(e) => setUsername(e.target.value)} />
  //     <input value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} />
  //     <input value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} />
  //     <button onClick={handleFirstPartyAuth}>Sign Up</button>
  //   </div>
  // )
  const [doBounce, setDoBounce] = useState(false)

  const handleToggleBounce = (): void => {
    setDoBounce(true)
    setTimeout(() => {
      setDoBounce(false)
    }, 250)
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
          <div className="w-full p-4 flex flex-col" style={{ maxWidth: 450 }}>
            <div className="w-full p-2 bg-pale rounded-md">
              <h1>Sign Up</h1>
              <input onChange={handleToggleBounce}></input>
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

export default SignUpPage
