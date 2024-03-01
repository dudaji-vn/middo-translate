export enum SCTranslation {
    SWAP_LANGUAGES = 'SWAP_LANGUAGES',
    TOGGLE_HISTORY = 'TOGGLE_HISTORY',
    TOGGLE_PHRASES = 'TOGGLE_PHRASES',
    TOGGLE_SPEECH_TO_TEXT = 'TOGGLE_SPEECH_TO_TEXT',
    EDIT_ESL_TRANSLATION = 'EDIT_ESL_TRANSLATION',
    CONFIRM_ESL_TRANSLATED = 'CONFIRM_ESL_TRANSLATED',
    TEXT_TO_SPEECH_INPUT = 'TEXT_TO_SPEECH_INPUT',
    COPY_INPUT = 'COPY_INPUT',
    TRANSLATED_TEXT_TO_SPEECH = 'TRANSLATED_TEXT_TO_SPEECH',
    TRANSLATED_COPY = 'TRANSLATED_COPY',
    COPY_ALL_TEXT = 'COPY_ALL_TEXT',
    COPY_IMAGE = 'COPY_IMAGE',
}

export enum SCConversation {
    NEW_CONVERSATION = 'NEW_CONVERSATION',
    TOGGLE_CONVERSATION_SETTINGS = 'TOGGLE_CONVERSATION_SETTINGS',
    SEARCH = 'SEARCH',
    SWITCH_TO_ALL_TAB = 'SWITCH_TO_ALL_TAB',
    SWITCH_TO_GROUP_TAB = 'SWITCH_TO_GROUP_TAB',
    VIEW_PINNED_MESSAGES = 'VIEW_PINNED_MESSAGES',
    VIEW_CONVERSATION_INFORMATION = 'VIEW_CONVERSATION_INFORMATION',
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

    // Conversation  ===============================================
    [SCConversation.NEW_CONVERSATION]: ['ctrl', 'n'],
    [SCConversation.TOGGLE_CONVERSATION_SETTINGS]: ['ctrl', 'k'],
    [SCConversation.SEARCH]: ['ctrl', 'f'],
    [SCConversation.SWITCH_TO_ALL_TAB]: ['ctrl', 'a'],
    [SCConversation.SWITCH_TO_GROUP_TAB]: ['ctrl', 'g'],
    [SCConversation.VIEW_PINNED_MESSAGES]: ['ctrl', 'p'],
    [SCConversation.VIEW_CONVERSATION_INFORMATION]: ['ctrl', 'i'],
    [SCConversation.UPLOAD_FILES]: ['ctrl', 'u'],
    [SCConversation.START_STOP_SPEECH_TO_TEXT]: ['ctrl', '/'],
    [SCConversation.OPEN_EMOJI]: ['ctrl', '.'],

    [SCConversation.OPEN_EDIT_TRANSLATION]: ['ctrl', 'o'], // 'dead' is the ctrl + alt + e
    [SCConversation.SAVE_EDIT_TRANSLATION]: ['ctrl', 's'],
    [SCConversation.CANCEL_EDIT_TRANSLATION]: ['escape'],

    [SCConversation.TURN_ON_OFF_TRANSLATION]: ['ctrl', '†'],
    [SCConversation.TURN_ON_OFF_TRANSLATION_PREVIEW]: ['ctrl', ','],

    // Translation  ===========================================
    [SCTranslation.SWAP_LANGUAGES]: ['ctrl', 's'],
    [SCTranslation.TOGGLE_HISTORY]: ['ctrl', 'h'],
    [SCTranslation.TOGGLE_PHRASES]: ['ctrl', 'p'],
    [SCTranslation.TOGGLE_SPEECH_TO_TEXT]: ['ctrl', '/'],
    [SCTranslation.EDIT_ESL_TRANSLATION]: ['ctrl', 'o'],
    [SCTranslation.CONFIRM_ESL_TRANSLATED]: ['ctrl', 'k'],
    [SCTranslation.TEXT_TO_SPEECH_INPUT]: ['ctrl', 'z'],
    [SCTranslation.COPY_INPUT]: ['ctrl', 'x'],
    [SCTranslation.TRANSLATED_TEXT_TO_SPEECH]: ['ctrl', '/'],
    [SCTranslation.TRANSLATED_COPY]: ['ctrl', '.'],
    [SCTranslation.COPY_ALL_TEXT]: ['ctrl', 'a'],
    [SCTranslation.COPY_IMAGE]: ['ctrl', 'i'],

    // Call  ===============================================
    [SCCall.MAXIMIZE_MINIMIZE_CALL]: ['ctrl', 'alt', 'm'], 
    [SCCall.ADD_MEMBERS]: ['ctrl', 'alt', 'å'],
    [SCCall.START_STOP_SCREEN_SHARING]: ['ctrl', 'alt', 's'],
    [SCCall.TOGGLE_CAMERA]: ['ctrl', 'alt', 'c'],
    [SCCall.TOGGLE_MICROPHONE]: ['ctrl', 'alt', 'm'],
    [SCCall.TEMPORARY_MICROPHONE_TOGGLE]: ['ctrl', 'alt', 'm'],
    [SCCall.TOGGLE_DISCUSSION]: ['ctrl', 'alt', 'd'],
    [SCCall.SWITCH_TO_GALLERY_VIEW]: ['ctrl', 'alt', 'g'],
    [SCCall.START_STOP_SCREEN_DOODLE]: ['ctrl', 'alt', '/'],
    [SCCall.TOGGLE_LIVE_CAPTION]: ['ctrl', 'alt', 'l'],
};


export const MAPPED_SPECIAL_KEYS: Record<string, string> = {
    'dead': 'e',
    '†': 't',
    'π': 'p',
    ' ': 'space',
    'å': 'a',
    'ß': 's',
    'ç': 'c',
    'µ': 'm',
    '∂': 'd',
    '©': 'g',
    '÷': '/',
    '¬': 'l',
};


export const SHORTCUT_CONTENTS: Record<SCConversation | SCTranslation | SCCall, string> = {
    [SCTranslation.SWAP_LANGUAGES]: "Swap Languages",
    [SCTranslation.TOGGLE_HISTORY]: "Show/Hide Translated History",
    [SCTranslation.TOGGLE_PHRASES]: "Open/Close Phrases",
    [SCTranslation.TOGGLE_SPEECH_TO_TEXT]: "Start/Stop Speech-to-text",
    [SCTranslation.EDIT_ESL_TRANSLATION]: "Edit E.S.L Translation",
    [SCTranslation.CONFIRM_ESL_TRANSLATED]: "Save Edited E.S.L Translation",
    [SCTranslation.TEXT_TO_SPEECH_INPUT]: "Text-to-speech Input",
    [SCTranslation.COPY_INPUT]: "Copy Input",
    [SCTranslation.TRANSLATED_COPY]: "Copy Translated",
    [SCTranslation.TRANSLATED_TEXT_TO_SPEECH]: "Text-to-speech Translated",
    [SCTranslation.COPY_ALL_TEXT]: "Copy All Text",
    [SCTranslation.COPY_IMAGE]: "Copy Image",
    [SCConversation.NEW_CONVERSATION]: "New Conversation",
    [SCConversation.TOGGLE_CONVERSATION_SETTINGS]: "Show/Hide Conversation Setting",
    [SCConversation.SEARCH]: "Search",
    [SCConversation.SWITCH_TO_ALL_TAB]: "Switch to 'All' Tab",
    [SCConversation.SWITCH_TO_GROUP_TAB]: "Switch to 'Group' Tab",
    [SCConversation.VIEW_PINNED_MESSAGES]: "View Pinned Messages",
    [SCConversation.VIEW_CONVERSATION_INFORMATION]: "View Conversation Information",
    [SCConversation.UPLOAD_FILES]: "Upload Files",
    [SCConversation.START_STOP_SPEECH_TO_TEXT]: "Start/Stop Speech-to-text",
    [SCConversation.OPEN_EMOJI]: "Open Emoji",
    [SCConversation.OPEN_EDIT_TRANSLATION]: "Open Edit Translation",
    [SCConversation.SAVE_EDIT_TRANSLATION]: "Save Edit Translation",
    [SCConversation.CANCEL_EDIT_TRANSLATION]: "Cancel Edit Translation",
    [SCConversation.TURN_ON_OFF_TRANSLATION]: "Turn On/Off Translation",
    [SCConversation.TURN_ON_OFF_TRANSLATION_PREVIEW]: "Turn On/Off Translation Preview",
    [SCCall.MAXIMIZE_MINIMIZE_CALL]: "Maximize/Minimize Call",
    [SCCall.ADD_MEMBERS]: "Add Members To Join",
    [SCCall.START_STOP_SCREEN_SHARING]: "Start/Stop Screen Sharing",
    [SCCall.TOGGLE_CAMERA]: "Turn On/Off Camera",
    [SCCall.TOGGLE_MICROPHONE]: "Turn On/Off Microphone",
    [SCCall.TEMPORARY_MICROPHONE_TOGGLE]: "Temporary Microphone Toggle",
    [SCCall.TOGGLE_DISCUSSION]: "Show/Hide Discussion",
    [SCCall.SWITCH_TO_GALLERY_VIEW]: "Switch to Gallery View",
    [SCCall.START_STOP_SCREEN_DOODLE]: "Start/Stop Screen Doodle",
    [SCCall.TOGGLE_LIVE_CAPTION]: "Show/Hide Live Caption",
};

