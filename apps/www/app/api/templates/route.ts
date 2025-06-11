import templates from './templates.json'
import { NextResponse } from 'next/server'

const handler = async () => {
  return NextResponse.json({ templates })
}

export { handler as GET }