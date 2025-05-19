import { AuthPageCallback } from '@/components/Callback'

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ access_code: string }>
}) {
  const { access_code } = await searchParams

  return <AuthPageCallback accessCode={access_code} />
}