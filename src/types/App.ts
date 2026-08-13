export type AppFlags = {
    // If false, prevents all client-side editing interactions.
    isEditable?: boolean
    // If true, show warning that user should save a copy
    isTemporaryFork?: boolean
    // If true, show warning that user should sign up to edit the document
    isPublicPreview?: boolean
    // If true, show only the 3D model full-bleed
    isGeometryOnly?: boolean
    // If true, will adjust camera on load and fire `onThumbnailReady`
    isThumbnail?: boolean
}

export type AppFeatures = {
    saveNew: boolean
    saveCopy: boolean
    controls: boolean
    export: boolean
    share: boolean
    versions: boolean
    feedback: boolean
}