export const CAMERA = {
    MINIMUM_ZOOM: 0.1,
    MAXIMUM_ZOOM: 4,
    ZOOM_BREAKPOINT_NEAR: 2.5,
    ZOOM_BREAKPOINT_FAR: 0.75,
} as const

export const COLORS = {
    /* Grayscale */
    DARK: '#414141',
    DARKGREY: '#A8A8A8',
    GREY: '#E7E7E7',
    LIGHT: '#FFFFFF',
    /* Neutrals */
    PALE: '#EFF2F2',
    /* Primary */
    GREEN: '#98E2C6',
    SWAMPGREEN: '#7BBFA5',
    DARKGREEN: '#093824',
    /* Special */
    ERROR: '#FF7171',
    ERRORDARK: '#DD6363',
    WARN: '#FFBE71',
    WARNDARK: '#E3AF71',
} as const

export const DIMENSIONS = {
    NODE_INTERNAL_PADDING: 5,
    NODE_LABEL_FONT_SIZE: 16,
    NODE_VALUE_FONT_SIZE: 12,
    NODE_LABEL_WIDTH: 32,
    NODE_MINIMUM_HEIGHT: 80,
    NODE_PORT_LABEL_FONT_SIZE: 18,
    NODE_PORT_LABEL_OFFSET: 12,
    NODE_PORT_HEIGHT: 40,
    NODE_PORT_MINIMUM_WIDTH: 50,
    NODE_PORT_RADIUS: 5,
    /** NODE_LABEL_WIDTH + 2 */
    NODE_RUNTIME_MESSAGE_BUBBLE_SIZE: 34,
    CONTEXT_MENU_WIDTH: 192,
    CONTEXT_MENU_MARGIN: 9,
    NUMBER_SLIDER_VALUE_WIDTH: 48,
    NUMBER_SLIDER_SLIDER_WIDTH: 128,
    NUMBER_SLIDER_HEIGHT: 36,
    NUMBER_SLIDER_HANDLE_HEIGHT: 24,
    NUMBER_SLIDER_HANDLE_WIDTH: 8,
    PANEL_DEFAULT_HEIGHT: 150,
    PANEL_DEFAULT_WIDTH: 200,
    VALUE_LIST_WIDTH: 180,
    VALUE_LIST_HEIGHT: 36,
    /** ~75% as wide as a default generic parameter (152), same height (32). */
    BOOLEAN_TOGGLE_WIDTH: 125,
    BOOLEAN_TOGGLE_HEIGHT: 40,
    BOOLEAN_TOGGLE_SWITCH_SIZE: 22,
    INTERACTION_BUFFER: 12
} as const

export const STYLES = {
    BUTTON: {
        SMALL: {
            xmlns: 'http://www.w3.org/2000/svg',
            width: 16,
            height: 16,
            fill: 'none',
            viewBox: '0 0 24 24',
            strokeWidth: 3,
            vectorEffect: 'non-scaling-stroke',
            stroke: COLORS.DARK,
        },
        MEDIUM: {
            xmlns: 'http://www.w3.org/2000/svg',
            width: 20,
            height: 20,
            fill: 'none',
            viewBox: '0 0 24 24',
            strokeWidth: 2,
            stroke: COLORS.DARK,
        },
    },
} as const

export const COMPONENTS = {
    NUMBER_SLIDER: '57da07bd-ecab-415d-9d86-af36d7073abc',
    PANEL: '59e0b89a-e487-49f8-bab8-b5bab16be14c',
    VALUE_LIST: '00027467-0d24-4fa7-b178-8dc0ac5f42ec',
    BOOLEAN_TOGGLE: '2e78987b-9dfb-42a2-8b76-3923ac8bd91a',
    ADDITION: 'a0d62394-a118-422d-abb3-6af115c75b25',
    SUBTRACTION: '9c007a04-d0d9-48e4-9da3-9ba142bc4d46',
    MULTIPLICATION: 'ce46b74e-00c9-43c4-805a-193b69ea4a11',
    DIVISION: '9c85271f-89fa-4e9f-9f4a-d75802120ccc',
    CONSTRUCT_POINT: '3581f42a-9592-4549-bd6b-1c0fc39d067b'
}

export const KEYS = {
    TOOLTIPS: {
        ADD_NODE_MENU_OPTION_HOVER: 'add-node-menu',
        PROGRESS_BAR_HOVER: 'progress-bar',
        PROGRESS_BAR_VIEW_DOCUMENT: 'progress-bar-document-progress',
        PROGRESS_BAR_VIEW_MODEL: 'progress-bar-model-progress',
        TEMPLATE_LIBRARY_CONTROL_OPTION_HOVER: 'template-library-control',
    },
    ELEMENT_IDS: {
        WIRES_MASK_ID: 'np-wires-mask',
    },
} as const

export const PARAMS = {
    PRIMITIVE: [
        'number',
        'integer',
        'boolean',
        'text',
        'string'
    ] as const,
    GEOMETRY: [
        'point',
        'circle',
        'curve',
        'line',
        'mesh',
        'surface',
        'extrusion',
        'brep'
    ] as const
}