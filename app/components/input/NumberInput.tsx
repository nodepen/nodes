import React, { useState, useEffect } from 'react'

type NumberInputProps = {
  value: string | number
  domain?: [number, number]
  onChange: (value: string) => void
  onFocus?: () => void
}

export const NumberInput = ({ value, domain, onChange, onFocus }: NumberInputProps): React.ReactElement => {
  const [internalValue, setInternalValue] = useState(value)

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInternalValue(e.target.value)
  }

  const handleBlur = (): void => {
    const incomingValue = internalValue.toString()

    if (incomingValue.match(/^\d+(\.\d+)?$/)) {
      if (domain) {
        const [min, max] = domain

        const number = Number.parseFloat(incomingValue)

        if (number < min) {
          onChange(min.toString())
          return
        }

        if (number > max) {
          onChange(max.toString())
          return
        }
      }

      onChange(incomingValue)
    }
  }

  const handleFocus = (): void => {
    if (onFocus) {
      onFocus()
    }
  }

  return (
    <input
      className="w-full pr-2 pl-2 text-center text-lg font-medium text-darkgreen bg-pale border-b-2 border-green"
      type="text"
      value={internalValue}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  )
}
