import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import useSWR from 'swr'


const fetchActiveUserToken = async (): Promise<{ speckleToken?: string, speckleServerUrl?: string }> => {
  const res = await fetch('/api/auth')
  return await res.json()
}

export const useNodepenSession = () => {
  const { data, status } = useSession()
  const { data: { speckleToken, speckleServerUrl } = {}, mutate } = useSWR('/api/auth', fetchActiveUserToken)
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()

  if (status !== 'authenticated' && status !== 'loading') {
    const accessCode = searchParams.get('access_code')
    if (!!accessCode) {
      signIn('credentials', { redirect: false, accessCode }).then(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('access_code')
        router.replace(`${pathName}${params.values().toArray().length > 0 ? `?${params.toString()}` : ''}`)
        mutate()
      })
    }
  }

  return {
    speckle: {
      token: speckleToken,
      serverUrl: speckleServerUrl
    },
    user: data?.user
  }
}