import type { ModelGeometryType } from "@/types/geometry"

// Given a parameter typeName (ex: 'point', 'mesh') return the valid rhino3dm geometry types that can be set for that parameter
export const getValidGeometryForType = (typeName: string): ModelGeometryType[] => {
    switch (typeName) {
        case 'point': {
            return ['Point']
        }
        case 'circle': {
            return ['Circle']
        }
        case 'curve': {
            return ['Curve']
        }
        case 'line': {
            return ['Line']
        }
        case 'mesh': {
            return ['Mesh']
        }
        case 'surface': {
            return ['Surface']
        }
        case 'extrusion': {
            return ['Extrusion']
        }
        case 'brep': {
            return ['Brep']
        }
        default: {
            console.log(`🐍 Unhandled value type: ${typeName}`)
            return []
        }
    }
}