import React from 'react'
import Link from 'next/link'

export const SignUpButton = (): React.ReactElement => {
  return (
    <Link href="/signup">
      <a className="h-6 pl-2 pr-2 leading-5 rounded-sm bg-dark text-white font-semibold text-xs">
        <p style={{ transform: 'translateY(1px)' }}>Sign Up</p>
      </a>
    </Link>
  )
}
