
type PrecisionInputProps = {
    precision: 0 | 1 | 2 | 3
    onChange: (value: 0 | 1 | 2 | 3) => void
}

export const PrecisionInput = ({ precision, onChange }: PrecisionInputProps) => {

    const validValues = [0, 1, 2, 3] as const

    const left = precision * (32 + 5.3)

    return (
        <div className="np-h-8 np-w-36 np-relative">
            <div className="np-absolute np-w-full np-h-full np-z-0">
                <div className="np-w-full np-h-full np-flex np-items-center np-justify-between">
                    {validValues.map((val) => (
                        <div key={`val-${val}`} className="np-w-8 np-h-8 np-text-sm np-font-sans np-font-semibold np-flex np-items-center np-justify-center np-rounded-sm hover:np-bg-grey hover:np-cursor-pointer" onClick={() => onChange(val)}>
                            {val}
                        </div>
                    ))}
                </div>
            </div>
            <div className="np-absolute np-w-full np-h-full np-z-10 np-pointer-events-none">
                <div className="np-relative np-w-full np-h-full">
                    <div className="np-absolute np-h-8 np-w-8 np-rounded-sm np-border-2 np-border-dark np-transition-all" style={{ transitionDuration: '275ms', transitionTimingFunction: 'ease-in', left: `${left}px` }} />
                </div>
            </div>
        </div>
    )
}