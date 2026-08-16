export type AppFlags = {
    // If false, prevents all client-side canvas editing interactions.
    isEditable?: boolean
    // If false, prevents all client-side
    isControlsEditable?: boolean
    // If true, will adjust camera on load, set model view to full bleed, and fire `onThumbnailReady`
    isThumbnail?: boolean
    // If true, will hide all UI elements except for the graph or model view, if either is enabled.
    hideInterface?: boolean
    // If true, the document-level menu button will be hidden
    hideDocumentMenu?: boolean
    // If true, will not draw the document. Controls will still be shown, if present.
    hideScript?: boolean
    // If true, will not show controls, even if they exist
    hideControls?: boolean
    // If true, will hide the "run script" button in controls.
    hideControlsRunButton?: boolean
}

export type AppFeatures = {
    enableFileSave: boolean
    enableFileSaveCopy: boolean
    enableFileExport: boolean
    enableDocumentControls: boolean
    enableDocumentVersions: boolean
    enableShareButton: boolean
    enableFeedbackButton: boolean
    enableProfileButton: boolean
}