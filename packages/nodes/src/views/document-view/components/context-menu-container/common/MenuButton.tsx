import React from 'react'

type MenuButtonProps = {
    icon: React.ReactNode
    label: string
    action: () => void
}

export const MenuButton = ({ icon, label, action }: MenuButtonProps) => {
    return (
        <button
            className='np-w-full np-p-2 np-flex np-items-center np-rounded-md hover:np-bg-green'
            onClick={action}>
            <div className='np-w-6 np-h-6 np-flex np-items-center np-justify-center'>
                {icon}
            </div>
            <div className='np-flex np-flex-grow np-items-center np-justify-start np-pl-4'>
                <p className='np-font-medium np-font-sans np-text-dark'>{label}</p>
            </div>
        </button>
    )
}