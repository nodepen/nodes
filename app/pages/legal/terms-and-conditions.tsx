import { LegalDocument } from '@/features/legal'
import { NextPage } from 'next'

export const TermsAndConditions: NextPage = () => {
  return <LegalDocument doc="TOS" />
}

export default TermsAndConditions
