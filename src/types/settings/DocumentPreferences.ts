export type DocumentPreferences = {
    /** Whether the label is the component's name or stored icon */
    componentLabels: 'icons' | 'names'
    /** Whether to show labels as nicknames (`C`) or full names (`Curve`) */
    parameterLabels: 'nickname' | 'fullname'
    /** Whether to draw type icon next to generic-parameter inputs/outputs */
    parameterTypeIcons: boolean
}