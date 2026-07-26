
// Given a parameter typeName (ex: 'point', 'mesh') return the valid rhino3dm geometry types that can be set for that parameter
export const getValidGeometryForType = (typeName: string): string[] => {
    switch (typeName) {
        case 'point': {
            return ['Point']
        }
        default: {
            console.log(`🐍 Unhandled value type: ${typeName}`)
            return []
        }
    }
}