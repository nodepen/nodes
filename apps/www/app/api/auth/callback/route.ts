import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

const handleGet = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const accessCode = searchParams.get('access_code')

  const res = await fetch(`http://127.0.0.1:3000/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      accessCode: accessCode,
      appId: 'dceec47704',
      appSecret: 'ad7cf9385f',
      challenge: 'okok'
    })
  })
  const data = await res.json()
  console.log(data)

  return new Response('Hello, Next.js!', {
    status: 200,
  })
}

export { handleGet as GET }