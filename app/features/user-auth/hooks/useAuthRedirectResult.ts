import { useEffect } from 'react'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { firebase } from 'features/common/context/session/auth/firebase'

export const useAuthRedirectResult = (redirectTo: string): void => {
  const router = useRouter()

  useEffect(() => {
    firebase
      .auth()
      .getRedirectResult()
      .then((res) => {
        if (res?.user) {
          return res.user.getIdToken()
        }
      })
      .then((token) => {
        if (token) {
          nookies.set(undefined, 'token', token)
          router.push(redirectTo)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
}
