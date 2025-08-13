import React from 'react'
import useSWR from 'swr'

const fetchDocuments = async () => {
  const data = await fetch('/api/documents')
  return await data.json()
}

const DocumentSelectionModal = () => {
  const { data } = useSWR('/documents', fetchDocuments)

  return <div>
    HEY THERE
    {data?.documents?.map((doc: any) => <p key={doc.meta.name}>{doc.meta.name}</p>)}
  </div>
}

export default React.memo(DocumentSelectionModal)