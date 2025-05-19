'use client'

import { getPublicEnv } from "@/utils/env"
import Link from "next/link"

export const Auth = () => {
  const {
    NEXT_PUBLIC_SPECKLE_SERVER_URL,
    NEXT_PUBLIC_SPECKLE_APP_ID,
    NEXT_PUBLIC_SPECKLE_APP_CHALLENGE
  } = getPublicEnv()

  return <Link href={`${NEXT_PUBLIC_SPECKLE_SERVER_URL}/authn/verify/${NEXT_PUBLIC_SPECKLE_APP_ID}/${NEXT_PUBLIC_SPECKLE_APP_CHALLENGE}`}>GO</Link>
}