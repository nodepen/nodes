import React, { useState } from 'react'
import Link from 'next/link'
import nookies from 'nookies'
import { firebase } from '@/features/common/context/session/auth/firebase'
import { Typography } from '@/features/common'
import { useRouter } from 'next/router'

type CurrentUserMenuProps = {
  user: {
    name: string | null
    photoUrl: string | null
  }
}

export const CurrentUserMenu = ({ user }: CurrentUserMenuProps): React.ReactElement => {
  const router = useRouter()

  const [useImageFallback, setUseImageFallback] = useState(false)

  const handleSignOut = (): void => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        nookies.destroy(undefined, 'token', { path: '/' })
        router.push('/', undefined, { shallow: false })
      })
  }

  return (
    <div className="p-2 rounded-md bg-green">
      <Link href={`/${user.name}`}>
        <a className="w-full flex items-stretch p-2 rounded-md hover:bg-swampgreen">
          <div className="mr-2 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-swampgreen">
              {useImageFallback ? null : (
                <img src={user.photoUrl ?? undefined} onError={() => setUseImageFallback(true)} alt="" />
              )}
            </div>
          </div>
          <div className="w-full flex flex-col justify-start pointer-events-none">
            <Typography.Label color="darkgreen" size="xs">
              Currently signed in as
            </Typography.Label>
            <Typography.Label color="darkgreen" size="md">
              {user.name ?? 'User'}
            </Typography.Label>
          </div>
        </a>
      </Link>
      <div className="w-full mt-2 mb-2 rounded-full bg-swampgreen" style={{ height: 2 }} />
      <button onClick={handleSignOut} className="w-full p-2 rounded-md hover:bg-swampgreen">
        <Typography.Label color="darkgreen" size="md" select={false}>
          Sign Out
        </Typography.Label>
      </button>
    </div>
  )
}
