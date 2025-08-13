import { NodePenDocumentManifest } from '@/sdk/types'
import React from 'react'
import useSWR from 'swr'

type Props = {
  onSelectDocument: (manifest: NodePenDocumentManifest) => Promise<void>
}

const fetchDocuments = async () => {
  const data = await fetch('/api/documents')
  return await data.json() as { documents: NodePenDocumentManifest[] }
}

const DocumentSelectionModal = ({ onSelectDocument }: Props) => {
  const { data } = useSWR('/documents', fetchDocuments)

  return <div>
    {data?.documents?.length === 0 ? 'No documents ):' : ''}
    {data?.documents?.map((doc) => <button key={doc.meta.name} onClick={() => onSelectDocument(doc)}>{doc.meta.name}</button>)}
  </div>
}

export default React.memo(DocumentSelectionModal)