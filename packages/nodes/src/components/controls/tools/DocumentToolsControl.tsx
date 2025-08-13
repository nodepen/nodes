import React from 'react'
import { Divider } from './Divider'
import DocumentViewToggle from './DocumentViewToggle'
import DocumentMetadata from './DocumentMetadata'
import DocumentModelSlider from './DocumentModelSlider'

const DocumentToolsControl = () => {
  return (
    <div className='np-h-16 np-p-0.5 np-flex np-items-center np-justify-center np-rounded-lg np-bg-light np-shadow-main'>
      <div className='np-h-full np-w-12 np-mr-0.5 np-border-2 np-border-dark np-rounded-md' />
      <div className='np-h-full np-w-12 np-border-2 np-border-dark np-rounded-md' />
      <Divider />
      <DocumentViewToggle />
      <Divider />
      <DocumentMetadata />
      <DocumentModelSlider />
    </div>
  )
}

export default React.memo(DocumentToolsControl)