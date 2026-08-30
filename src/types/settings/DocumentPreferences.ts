export type DocumentPreferences = {
    /** Whether a component is drawn as its icon or as its name. */
    componentLabels: 'icons' | 'names'
    /** Whether a parameter is labelled with its nickname (`Crv`) or its full name (`Curve`). */
    parameterLabels: 'nickname' | 'fullname'
}