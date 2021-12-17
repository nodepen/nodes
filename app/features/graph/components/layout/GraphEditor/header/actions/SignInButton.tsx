import React from 'react'
import Link from 'next/link'

export const SignInButton = (): React.ReactElement => {
  return (
    <Link href="/signin">
      <a className="h-6 pl-2 pr-2 mr-2 leading-5 rounded-sm border-2 border-dark text-dark font-semibold text-xs">
        <p style={{ transform: 'translateY(-1px)' }}>Sign In</p>
      </a>
    </Link>
  )
}
