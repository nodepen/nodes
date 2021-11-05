import React from 'react'
import { NodePen } from 'glib'
import { Typography } from '@/features/common'
import { coerceValue } from '../utils'
import { getDataTreePathString } from '@/features/graph/utils'

type NumberSliderDetailsProps = {
  element: NodePen.Element<'number-slider'>
}

export const NumberSliderDetails = ({ element }: NumberSliderDetailsProps): React.ReactElement => {
  const { current } = element

  const icon =
    'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARHSURBVEhLrVZZKKV9HD52yhJRlCXuZMqFciFSLtyQC0UpuZkyERFjJzvZiWxj3/d93/fs29gbiSGyXJGdZ97f//O+4xDfxfedejpH3vM8v/X5HRH3kuRevtLS0mfcZ/wfkJGROeP4/LjPksTu9vXr17vr62s8Pz8zPD094fHxkeHh4YHh/v6e4e7ujuH29lbAzc2NAOI5PT2Fk5PTLScSIOLUjq6urvDr1y/Mzc0xzM/PY2FhgWFxcRFLS0tYXl7GysoKVldX8fPnT6ytrWF9fR0bGxvY3NzE1tYWtre3sbOzg4ODA/z+/RuysrJnIgkJiSeKuq+vj6G/vx+Dg4MYGhrC8PAwRkZGMDo6ivHxcUxMTGBychJTU1OYnp7GzMwMZmdnhaBeB3N+fs6XTMRKUFdXh/r6ejQ2NqKpqQktLS1obW1Fe3s7Ojo60NXVhe7ubvT29rJABgYGWCB8EGNjYywIPoDj4+O/AlTbHz9+oLCwEMXFxSgtLUVZWRkqKipQVVWF6upq1NbWCgE0Nze/E+/p6REqQNlTiQQBak5KSgrS0tKQkZGBrKwsZGdnIzc3F/n5+SgoKICtra0YPhPt7OzE7u7uX4HLy0tEREQgKioKsbGxiI+PR0JCApKTk5GamspETUxMxPA6Wz7T14LUcEHg4uIC3KjC1dUVbm5u8PDwgJeXF3x8fODn54fAwED+YQEURGJiIss8PT0dmZmZLOu8vDyWMTX85VkRm9tv377B3d0dnp6e8Pb2FiMPCQkRIyckJSWx7N6SU2YlJSVsml6eFeHk5ESM3NfXF/7+/ggKCkJoaCjCw8PFyAl86ahfOTk5rFc8eXl5uXgGR0dHn5JTb3hiHp+RUz/EBA4PDz8kp4bypG9hbm7+jpyfLrES7e/v4/v37wgICEBwcDDCwsKEqSLo6OiIERP09fVZ9G/JaWFpimibX54VYW9v7x15dHQ04uLi2LhSJkpKSgK5srIyG+GioiJhTF+TkwuICdBSfERORLSAVD7OHRno2c/IadnEBMhJPyPnx9DZ2RkuLi4fktMm89ZBzisIkMVGRkbC0dGRNe7Lly+sxpqamlBVVYWioiLk5OQgJSXFvkTv8vLyrGzq6uqsR4aGhjAzM4O9vT0bErJ1QYC8PCYmho4ELC0tYWxsDAMDA2hpaUFNTY0RKSgo0KVi5PROf1MvNDQ0oKenByMjI1hYWMDBwYFVg26GIEAHg199a2trYTu1tbWF1acsyGErKysZOXkO2ToFQWUhK7eysmIWTvZNB0kQoKvE+4qdnZ1Qc8qCH0MqFS1QTU0NVFRUGDnVXFdXl1k12bSNjQ07TnSYBAE6a3Q0KLJ/205aoIaGBmbNbW1tzJZ5croBPDldOfof16czER1mU1PTa7pQ1BjqPoHG7DPwz/E3mkA3miKnknE9ueaCD6ASSdJPDHag/6nZfwZFzvFxP1tEkn8Am4lkKqvpHb8AAAAASUVORK5CYII='

  const { precision, rounding, domain, values } = current

  const getPrecisionLabel = (r: typeof rounding): string => {
    switch (r) {
      case 'rational':
        return 'Floating point accuracy'
      case 'integer':
        return 'Integer accuracy'
      case 'even':
        return 'Even number accurac'
      case 'odd':
        return 'Odd number accuracy'
    }
  }

  const precisionLabel = getPrecisionLabel(rounding)

  const [domainMinimumValue, domainMinimumString] = coerceValue(domain[0], precision)
  const domainMinimumLabel = `Lower limit: ${domainMinimumString}`

  const [domainMaximumValue, domainMaximumString] = coerceValue(domain[1], precision)
  const domainMaximumLabel = `Upper limit: ${domainMaximumString}`

  const currentValue = values['output'][getDataTreePathString([0])][0].value as number
  const [, currentValueString] = coerceValue(currentValue, precision)
  const currentValueLabel = `Value: ${currentValueString}`

  const factorValue = Math.round(
    ((currentValue - domainMinimumValue) / (domainMaximumValue - domainMinimumValue)) * 100
  )
  const factorLabel = `Factor: ${factorValue}%`

  return (
    <>
      <div className="w-full h-12 flex items-center justify-start">
        <img
          className="ml-2 mr-4"
          src={`data:image/png;base64,${icon}`}
          alt={`Icon for the number slider component.`}
        />
        <Typography.Label size="lg" color="darkgreen">
          Number Slider
        </Typography.Label>
      </div>
      <div className="ml-12 mr-2 mb-5">
        <Typography.Label size="sm" color="darkgreen">
          Numeric slider for single values
        </Typography.Label>
      </div>
      <div className="w-full p-2 bg-pale rounded-md flex flex-col justify-start items-center">
        <Typography.Data size="sm" color="dark">
          {precisionLabel}
        </Typography.Data>
        <Typography.Data size="sm" color="dark">
          {domainMinimumLabel}
        </Typography.Data>
        <Typography.Data size="sm" color="dark">
          {domainMaximumLabel}
        </Typography.Data>
        <Typography.Data size="sm" color="dark">
          {currentValueLabel}
        </Typography.Data>
        <Typography.Data size="sm" color="dark">
          {factorLabel}
        </Typography.Data>
      </div>
    </>
  )
}
