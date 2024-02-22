export enum SCTranslation {
    SWAP_LANGUAGES = 'SWAP_LANGUAGES',
    TOGGLE_HISTORY = 'TOGGLE_HISTORY',
    TOGGLE_PHRASES = 'TOGGLE_PHRASES',
    TOGGLE_SPEECH_TO_TEXT = 'TOGGLE_SPEECH_TO_TEXT',
}

export enum SCConversation {
    NEW_CONVERSATION = 'NEW_CONVERSATION',
    TOGGLE_CONVERSATION_SETTINGS = 'TOGGLE_CONVERSATION_SETTINGS',
    SEARCH = 'SEARCH',
    SWITCH_TO_ALL_TAB = 'SWITCH_TO_ALL_TAB',
    SWITCH_TO_GROUP_TAB = 'SWITCH_TO_GROUP_TAB',
    VIEW_PINNED_MESSAGES = 'VIEW_PINNED_MESSAGES',
    VIEW_CONVERSATION_INFORMATION = 'VIEW_CONVERSATION_INFORMATION',
    SWITCH_INPUT_LANGUAGE = 'SWITCH_INPUT_LANGUAGE',
    UPLOAD_FILES = 'UPLOAD_FILES',
    START_STOP_SPEECH_TO_TEXT = 'START_STOP_SPEECH_TO_TEXT',
    OPEN_EMOJI = 'OPEN_EMOJI',
    OPEN_EDIT_TRANSLATION = 'OPEN_EDIT_TRANSLATION',
    SAVE_EDIT_TRANSLATION = 'SAVE_EDIT_TRANSLATION',
    CANCEL_EDIT_TRANSLATION = 'CANCEL_EDIT_TRANSLATION',
    TURN_ON_OFF_TRANSLATION = 'TURN_ON_OFF_TRANSLATION',
    TURN_ON_OFF_TRANSLATION_PREVIEW = 'TURN_ON_OFF_TRANSLATION_PREVIEW',
}

export enum SCCall {
    MAXIMIZE_MINIMIZE_CALL = 'MAXIMIZE_MINIMIZE_CALL',
    ADD_MEMBERS = 'ADD_MEMBERS',
    START_STOP_SCREEN_SHARING = 'START_STOP_SCREEN_SHARING',
    TOGGLE_CAMERA = 'TOGGLE_CAMERA',
    TOGGLE_MICROPHONE = 'TOGGLE_MICROPHONE',
    TEMPORARY_MICROPHONE_TOGGLE = 'TEMPORARY_MICROPHONE_TOGGLE',
    TOGGLE_DISCUSSION = 'TOGGLE_DISCUSSION',
    SWITCH_TO_GALLERY_VIEW = 'SWITCH_TO_GALLERY_VIEW',
    START_STOP_SCREEN_DOODLE = 'START_STOP_SCREEN_DOODLE',
    TOGGLE_LIVE_CAPTION = 'TOGGLE_LIVE_CAPTION',
}

export const SHORTCUTS: Record<
    SCConversation | SCTranslation | SCCall,
    string[]
> = {
    [SCConversation.NEW_CONVERSATION]: ['shift', 'n'],
    [SCConversation.TOGGLE_CONVERSATION_SETTINGS]: ['shift', '?'],
    [SCConversation.SEARCH]: ['shift', 'f'],
    [SCConversation.SWITCH_TO_ALL_TAB]: ['shift', 'a'],
    [SCConversation.SWITCH_TO_GROUP_TAB]: ['shift', 'g'],
    [SCConversation.VIEW_PINNED_MESSAGES]: ['shift', 'p'],
    [SCConversation.VIEW_CONVERSATION_INFORMATION]: ['shift', 'i'],
    [SCConversation.SWITCH_INPUT_LANGUAGE]: ['shift', 'l'],
    [SCConversation.UPLOAD_FILES]: ['shift', 'u'],
    [SCConversation.START_STOP_SPEECH_TO_TEXT]: ['shift', ' '],
    [SCConversation.OPEN_EMOJI]: ['shift', ','],

    [SCTranslation.SWAP_LANGUAGES]: ['s'],
    [SCTranslation.TOGGLE_HISTORY]: ['h'],
    [SCTranslation.TOGGLE_PHRASES]: ['p'],
    [SCTranslation.TOGGLE_SPEECH_TO_TEXT]: [' '],
    [SCConversation.OPEN_EDIT_TRANSLATION]: ['dead'],
    [SCConversation.TURN_ON_OFF_TRANSLATION]: ['†'], // '†' is the ctrl + alt + t
    [SCConversation.TURN_ON_OFF_TRANSLATION_PREVIEW]: ['π'], // 'π' is the ctrl + alt + p
    [SCConversation.SAVE_EDIT_TRANSLATION]: ['ctrl', 'enter'],
    [SCConversation.CANCEL_EDIT_TRANSLATION]: ['escape'],

    [SCCall.MAXIMIZE_MINIMIZE_CALL]: ['shift', 'm'],
    [SCCall.ADD_MEMBERS]: ['a'],
    [SCCall.START_STOP_SCREEN_SHARING]: ['s'],
    [SCCall.TOGGLE_CAMERA]: ['c'],
    [SCCall.TOGGLE_MICROPHONE]: ['m'],
    [SCCall.TEMPORARY_MICROPHONE_TOGGLE]: [' '],
    [SCCall.TOGGLE_DISCUSSION]: ['d'],
    [SCCall.SWITCH_TO_GALLERY_VIEW]: ['g'],
    [SCCall.START_STOP_SCREEN_DOODLE]: ['e'],
    [SCCall.TOGGLE_LIVE_CAPTION]: ['l'],
};

export interface ShortcutInfo {
    title: string;
    description: string;
}
export const ShortcutsContents: Record<
    SCConversation | SCTranslation | SCCall,
    ShortcutInfo
> = {
    [SCConversation.NEW_CONVERSATION]: {
        title: 'New Conversation',
        description: 'Start a new conversation',
    },
    [SCConversation.TOGGLE_CONVERSATION_SETTINGS]: {
        title: 'Toggle Conversation Settings',
        description: 'Open or close conversation settings',
    },
    [SCConversation.SEARCH]: {
        title: 'Search',
        description: 'Search within the conversation',
    },
    [SCConversation.SWITCH_TO_ALL_TAB]: {
        title: 'Switch to All Tab',
        description: 'Switch to the All tab in conversation view',
    },
    [SCConversation.SWITCH_TO_GROUP_TAB]: {
        title: 'Switch to Group Tab',
        description: 'Switch to the Group tab in conversation view',
    },
    [SCConversation.VIEW_PINNED_MESSAGES]: {
        title: 'View Pinned Messages',
        description: 'View all pinned messages in the conversation',
    },
    [SCConversation.VIEW_CONVERSATION_INFORMATION]: {
        title: 'View Conversation Information',
        description: 'View detailed information about the conversation',
    },
    [SCConversation.SWITCH_INPUT_LANGUAGE]: {
        title: 'Switch Input Language',
        description: 'Change the input language for the conversation',
    },
    [SCConversation.UPLOAD_FILES]: {
        title: 'Upload Files',
        description: 'Attach files to the conversation',
    },
    [SCConversation.START_STOP_SPEECH_TO_TEXT]: {
        title: 'Start/Stop Speech to Text',
        description: 'Start or stop converting speech to text',
    },
    [SCConversation.OPEN_EMOJI]: {
        title: 'Open Emoji',
        description: 'Open the emoji picker',
    },
    [SCTranslation.SWAP_LANGUAGES]: {
        title: 'Swap Languages',
        description: 'Swap the source and target languages for translation',
    },
    [SCTranslation.TOGGLE_HISTORY]: {
        title: 'Toggle History',
        description: 'Show or hide the translation history',
    },
    [SCTranslation.TOGGLE_PHRASES]: {
        title: 'Toggle Phrases',
        description: 'Show or hide the translation phrases',
    },
    [SCTranslation.TOGGLE_SPEECH_TO_TEXT]: {
        title: 'Toggle Speech to Text',
        description: 'Start or stop converting speech to text',
    },
    [SCConversation.OPEN_EDIT_TRANSLATION]: {
        title: 'Open Edit Translation',
        description: 'Open the edit translation dialog',
    },
    [SCConversation.TURN_ON_OFF_TRANSLATION]: {
        title: 'Turn On/Off Translation',
        description: 'Turn on or off the translation',
    },
    [SCConversation.TURN_ON_OFF_TRANSLATION_PREVIEW]: {
        title: 'Turn On/Off Translation Preview',
        description: 'Turn on or off the translation preview',
    },
    [SCConversation.SAVE_EDIT_TRANSLATION]: {
        title: 'Save Edit Translation',
        description: 'Save the edited translation',
    },
    [SCConversation.CANCEL_EDIT_TRANSLATION]: {
        title: 'Cancel Edit Translation',
        description: 'Cancel the edited translation',
    },
    [SCCall.MAXIMIZE_MINIMIZE_CALL]: {
        title: 'Maximize/Minimize Call',
        description: 'Maximize or minimize the call',
    },
    [SCCall.ADD_MEMBERS]: {
        title: 'Add Members',
        description: 'Add members to the call',
    },
    [SCCall.START_STOP_SCREEN_SHARING]: {
        title: 'Start/Stop Screen Sharing',
        description: 'Start or stop sharing your screen',
    },
    [SCCall.TOGGLE_CAMERA]: {
        title: 'Toggle Camera',
        description: 'Turn the camera on or off',
    },
    [SCCall.TOGGLE_MICROPHONE]: {
        title: 'Toggle Microphone',
        description: 'Turn the microphone on or off',
    },
    [SCCall.TEMPORARY_MICROPHONE_TOGGLE]: {
        title: 'Temporary Microphone Toggle',
        description: 'Temporarily turn the microphone on or off',
    },
    [SCCall.TOGGLE_DISCUSSION]: {
        title: 'Toggle Discussion',
        description: 'Open or close the discussion',
    },
    [SCCall.SWITCH_TO_GALLERY_VIEW]: {
        title: 'Switch to Gallery View',
        description: 'Switch to gallery view',
    },
    [SCCall.START_STOP_SCREEN_DOODLE]: {
        title: 'Start/Stop Screen Doodle',
        description: 'Start or stop screen doodle',
    },
    [SCCall.TOGGLE_LIVE_CAPTION]: {
        title: 'Toggle Live Caption',
        description: 'Turn live caption on or off',
    },
};
