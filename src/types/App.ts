export type AppFlags = {
    // If false, prevents all client-side editing interactions.
    isEditable?: boolean
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
}

export type AppFeatures = {
    enableFileSave: boolean
    enableFileExport: boolean
    enableDocumentControls: boolean
    enableDocumentVersions: boolean
    enableShareButton: boolean
    enableFeedbackButton: boolean
    enableProfileButton: boolean
}