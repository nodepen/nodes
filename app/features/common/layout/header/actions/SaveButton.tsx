import React from 'react'

const SaveButton = (): React.ReactElement => {
  return (
    <button className="h-6 mr-2 pl-1 pr-2 rounded-sm border-2 border-dark flex items-center leading-5 text-dark font-semibold text-xs">
      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"></path>
      </svg>
      <p>Save</p>
    </button>
  )
}

export default React.memo(SaveButton)
