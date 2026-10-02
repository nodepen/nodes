export type ModelGeometryType =
    // Literal object type matches
    | 'Point'
    | 'Curve'
    | 'Mesh'
    | 'Extrusion'
    // Objets types with specific properties
    | 'Circle'
    | 'Line'
    | 'Surface'
    | 'Brep'
