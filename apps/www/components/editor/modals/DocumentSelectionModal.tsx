"use client"

import { NodePenDocumentManifest } from '@/sdk/types'
import React, { useCallback } from 'react'
import useSWR from 'swr'

type Props = {
  onSelectDocument: (manifest: NodePenDocumentManifest) => Promise<void>
}

const fetchDocuments = async () => {
  const data = await fetch('/api/documents')
  return await data.json() as { documents: NodePenDocumentManifest[] }
}

const createNewDocument = async () => {
  const data = await fetch('/api/documents', {
    method: 'POST'
  })
  return await data.json() as { document: NodePenDocumentManifest }
}

const DocumentSelectionModal = ({ onSelectDocument }: Props) => {
  const { data, mutate } = useSWR('/documents', fetchDocuments)

  const documents = data?.documents ?? []

  const handleCreateDocument = useCallback(async () => {
    const doc = await createNewDocument()
    mutate({
      documents: [
        doc.document,
        ...(data?.documents ?? [])
      ]
    })
  }, [data, mutate])

  return <div className='w-full flex flex-col justify-start'>
    <div className='w-full mb-2 flex justify-between items-center'>
      <div>SEARCH</div>
      <div onClick={handleCreateDocument}>NEW</div>
    </div>
    <div className='w-full flex flex-col justify-start'>
      {documents.map((doc) => (
        <div key={doc.meta.id} className='w-full h-10 mb-2 border-2 rounded-md border-black' onClick={() => onSelectDocument(doc)}>
          {doc.meta.name}
        </div>
      ))}
    </div>
  </div>
}

export default React.memo(DocumentSelectionModal)