import { getSpeckleRequestContext } from '@/utils/auth'
import { NextRequest, NextResponse } from 'next/server'

const handler = async (req: NextRequest) => {
  const context = await getSpeckleRequestContext(req)
  return NextResponse.json(context ?? {})
}

export { handler as GET }