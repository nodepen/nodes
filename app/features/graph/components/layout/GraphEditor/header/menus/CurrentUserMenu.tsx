import { Typography } from '@/features/common'
import { useSessionManager } from '@/features/common/context/session'
import React from 'react'

export const CurrentUserMenu = (): React.ReactElement => {
  const { userRecord } = useSessionManager()

  return (
    <div className="p-2 rounded-md bg-green">
      <button className="w-full flex items-stretch p-2 rounded-md hover:bg-swampgreen">
        <div className="mr-2 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-swampgreen" />
        </div>
        <div className="w-full flex flex-col justify-start pointer-events-none">
          <Typography.Label color="darkgreen" size="sm">
            Currently signed in as
          </Typography.Label>
          <Typography.Label color="darkgreen" size="md">
            {userRecord?.username}
          </Typography.Label>
        </div>
      </button>
    </div>
  )
}
