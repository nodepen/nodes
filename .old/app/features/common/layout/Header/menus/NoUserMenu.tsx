import React from 'react'
import Link from 'next/link'
import { Typography } from '@/features/common'

export const NoUserMenu = (): React.ReactElement => {
  return (
    <div className="p-2 flex flex-col items-center rounded-md bg-green">
      <Link href="/signup">
        <a className="w-full p-2 rounded-md hover:bg-swampgreen">
          <Typography.Label color="darkgreen" size="md" select={false}>
            Sign Up
          </Typography.Label>
        </a>
      </Link>
      <Link href="/signin">
        <a className="w-full p-2 rounded-md hover:bg-swampgreen text">
          <Typography.Label color="darkgreen" size="md" select={false}>
            Sign In
          </Typography.Label>
        </a>
      </Link>
    </div>
  )
}
