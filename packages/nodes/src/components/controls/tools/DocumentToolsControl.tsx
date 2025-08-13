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
      <div className='np-h-full np-flex np-flex-col np-justify-start np-items-center'>
        <div className='np-flex np-mb-0.5 np-items-center'>
          <div className='np-w-[29px] np-h-[29px] np-rounded-tl-md np-border-2 np-border-dark np-mr-0.5' />
          <div className='np-w-[29px] np-h-[29px] np-border-2 np-border-dark np-mr-0.5' />
          <div className='np-w-[29px] np-h-[29px] np-rounded-tr-md np-border-2 np-border-dark np-mr-0.5' />
        </div>
        <div className='np-flex np-items-center'>
          <div className='np-w-[29px] np-h-[29px] np-rounded-bl-md np-border-2 np-border-dark np-mr-0.5' />
          <div className='np-w-[29px] np-h-[29px] np-border-2 np-border-dark np-mr-0.5' />
          <div className='np-w-[29px] np-h-[29px] np-rounded-br-md np-border-2 np-border-dark np-mr-0.5' />
        </div>
      </div>
      <DocumentModelSlider />
    </div>
  )
}

export default React.memo(DocumentToolsControl)