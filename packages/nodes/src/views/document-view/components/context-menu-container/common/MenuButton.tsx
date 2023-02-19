import React from 'react'

type MenuButtonProps = {
    icon: React.ReactNode
    label: string
    action: () => void
}

export const MenuButton = ({ icon, label, action }: MenuButtonProps) => {
    return (
        <button
            className='np-w-full np-h-8 np-pl-[6px] np-mb-1 last:np-mb-0 np-flex np-items-center np-rounded-sm np-bg-light hover:np-bg-grey'
            onClick={action}
        >
            <div className='np-h-full np-w-5 np-flex np-flex-col np-items-center np-justify-center'>
                {icon}
            </div>
            <div className='np-pl-2 np-flex np-flex-grow np-items-center np-justify-start'>
                <p className='np-font-sans np-font-medium np-text-dark np-text-sm -np-translate-y-px'>{label}</p>
            </div>
        </button>
    )
}