"use client"

import { useRouter } from "next/navigation"
import DocumentSelectionModal from "../editor/modals/DocumentSelectionModal"

const HomePage = () => {
  const router = useRouter()

  return <DocumentSelectionModal onSelectDocument={async (doc) => { router.push(`/doc/${doc.meta.id}`) }} />
}

export default HomePage