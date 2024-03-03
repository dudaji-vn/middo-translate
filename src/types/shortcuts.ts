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
  [SCConversation.NEW_CONVERSATION]: ['ctrl_or_alt', 'n'],
  [SCConversation.TOGGLE_CONVERSATION_SETTINGS]: ['ctrl_or_alt', 'k'],
  [SCConversation.SEARCH]: ['ctrl_or_alt', 'f'],
  [SCConversation.SWITCH_TO_ALL_TAB]: ['ctrl_or_alt', 'a'],
  [SCConversation.SWITCH_TO_GROUP_TAB]: ['ctrl_or_alt', 'g'],
  [SCConversation.VIEW_PINNED_MESSAGES]: ['ctrl_or_alt', 'p'],
  [SCConversation.VIEW_CONVERSATION_INFORMATION]: ['ctrl_or_alt', 'i'],
  [SCConversation.UPLOAD_FILES]: ['ctrl_or_alt', 'u'],
  [SCConversation.START_STOP_SPEECH_TO_TEXT]: ['ctrl_or_alt', '/'],
  [SCConversation.OPEN_EMOJI]: ['ctrl_or_alt', '.'],

  [SCConversation.OPEN_EDIT_TRANSLATION]: ['ctrl_or_alt', 'o'], // 'dead' is the ctrl + alt + e
  [SCConversation.SAVE_EDIT_TRANSLATION]: ['ctrl_or_alt', 's'],
  [SCConversation.CANCEL_EDIT_TRANSLATION]: ['esc'],

  [SCConversation.TURN_ON_OFF_TRANSLATION]: ['ctrl_or_alt', 't'],
  [SCConversation.TURN_ON_OFF_TRANSLATION_PREVIEW]: ['ctrl_or_alt', ','],

  // Translation  ===========================================
  [SCTranslation.SWAP_LANGUAGES]: ['ctrl_or_alt', 's'],
  [SCTranslation.TOGGLE_HISTORY]: ['ctrl_or_alt', 'h'],
  [SCTranslation.TOGGLE_PHRASES]: ['ctrl_or_alt', 'p'],
  [SCTranslation.TOGGLE_SPEECH_TO_TEXT]: ['ctrl_or_alt', '/'],

  [SCTranslation.EDIT_ESL_TRANSLATION]: ['ctrl_or_alt', 'o'],
  [SCTranslation.CONFIRM_ESL_TRANSLATED]: ['ctrl_or_alt', 'k'],
  
  [SCTranslation.TEXT_TO_SPEECH_INPUT]: ['ctrl_or_alt', 'z'],
  [SCTranslation.COPY_INPUT]: ['ctrl_or_alt', 'x'],
  [SCTranslation.TRANSLATED_TEXT_TO_SPEECH]: ['ctrl_or_alt', '/'],
  [SCTranslation.TRANSLATED_COPY]: ['ctrl_or_alt', '.'],
  [SCTranslation.COPY_ALL_TEXT]: ['ctrl_or_alt', 'a'],
  [SCTranslation.COPY_IMAGE]: ['ctrl_or_alt', 'i'],

  // Call  ===============================================
  [SCCall.MAXIMIZE_MINIMIZE_CALL]: ['ctrl', 'alt', 'Ω'],
  [SCCall.ADD_MEMBERS]: ['ctrl', 'alt', 'å'],
  [SCCall.START_STOP_SCREEN_SHARING]: ['ctrl', 'alt', 'ß'],
  [SCCall.TOGGLE_CAMERA]: ['ctrl', 'alt', 'ç'],
  [SCCall.TOGGLE_MICROPHONE]: ['ctrl', 'alt', 'µ'],
  [SCCall.TOGGLE_DISCUSSION]: ['ctrl', 'alt', '∂'],
  [SCCall.SWITCH_TO_GALLERY_VIEW]: ['ctrl', 'alt', '©'],
  [SCCall.START_STOP_SCREEN_DOODLE]: ['ctrl', 'alt', '÷'],
  [SCCall.TOGGLE_LIVE_CAPTION]: ['ctrl', 'alt', '¬'],
};

export const MAPPED_MAC_KEYS: Record<string, string> = {
  ctrl_or_alt: 'ctrl',
};

export const transferSpecialKey: (
  isMacOs?: boolean,
) => Record<string, string> = (isMacOs) => ({
  dead: 'e',
  '†': 't',
  π: 'p',
  ' ': 'space',
  å: 'a',
  ß: 's',
  ç: 'c',
  µ: 'm',
  '∂': 'd',
  '©': 'g',
  '÷': '/',
  '¬': 'l',
  Ω: 'z',
  ctrl: 'Control',
  alt: isMacOs ? 'Option' : 'Alt',
});

export const MAPPED_WIN_KEYS: Record<string, string> = {
  ...transferSpecialKey(),
  ctrl_or_alt: 'alt',
  ctrl: 'ctrl',
  alt: 'alt',
};

export const SHORTCUT_CONTENTS: Record<
  SCConversation | SCTranslation | SCCall,
  string
> = {
  [SCTranslation.SWAP_LANGUAGES]: 'Swap Languages',
  [SCTranslation.TOGGLE_HISTORY]: 'Show/Hide Translated History',
  [SCTranslation.TOGGLE_PHRASES]: 'Open/Close Phrases',
  [SCTranslation.TOGGLE_SPEECH_TO_TEXT]: 'Start/Stop Speech-to-text',
  [SCTranslation.EDIT_ESL_TRANSLATION]: 'Edit E.S.L Translation',
  [SCTranslation.CONFIRM_ESL_TRANSLATED]: 'Save Edited E.S.L Translation',
  [SCTranslation.TEXT_TO_SPEECH_INPUT]: 'Text-to-speech Input',
  [SCTranslation.COPY_INPUT]: 'Copy Input',
  [SCTranslation.TRANSLATED_COPY]: 'Copy Translated',
  [SCTranslation.TRANSLATED_TEXT_TO_SPEECH]: 'Text-to-speech Translated',
  [SCTranslation.COPY_ALL_TEXT]: 'Copy All Text',
  [SCTranslation.COPY_IMAGE]: 'Copy Image',
  [SCConversation.NEW_CONVERSATION]: 'New Conversation',
  [SCConversation.TOGGLE_CONVERSATION_SETTINGS]:
    'Show/Hide Conversation Setting',
  [SCConversation.SEARCH]: 'Search',
  [SCConversation.SWITCH_TO_ALL_TAB]: "Switch to 'All' Tab",
  [SCConversation.SWITCH_TO_GROUP_TAB]: "Switch to 'Group' Tab",
  [SCConversation.VIEW_PINNED_MESSAGES]: 'View Pinned Messages',
  [SCConversation.VIEW_CONVERSATION_INFORMATION]:
    'View Conversation Information',
  [SCConversation.UPLOAD_FILES]: 'Upload Files',
  [SCConversation.START_STOP_SPEECH_TO_TEXT]: 'Start/Stop Speech-to-text',
  [SCConversation.OPEN_EMOJI]: 'Open Emoji',
  [SCConversation.OPEN_EDIT_TRANSLATION]: 'Open Edit Translation',
  [SCConversation.SAVE_EDIT_TRANSLATION]: 'Save Edit Translation',
  [SCConversation.CANCEL_EDIT_TRANSLATION]: 'Cancel Edit Translation',
  [SCConversation.TURN_ON_OFF_TRANSLATION]: 'Turn On/Off Translation',
  [SCConversation.TURN_ON_OFF_TRANSLATION_PREVIEW]:
    'Turn On/Off Translation Preview',
  [SCCall.MAXIMIZE_MINIMIZE_CALL]: 'Maximize/Minimize Call',
  [SCCall.ADD_MEMBERS]: 'Add Members To Join',
  [SCCall.START_STOP_SCREEN_SHARING]: 'Start/Stop Screen Sharing',
  [SCCall.TOGGLE_CAMERA]: 'Turn On/Off Camera',
  [SCCall.TOGGLE_MICROPHONE]: 'Turn On/Off Microphone',
  [SCCall.TOGGLE_DISCUSSION]: 'Show/Hide Discussion',
  [SCCall.SWITCH_TO_GALLERY_VIEW]: 'Switch to Gallery View',
  [SCCall.START_STOP_SCREEN_DOODLE]: 'Start/Stop Screen Doodle',
  [SCCall.TOGGLE_LIVE_CAPTION]: 'Show/Hide Live Caption',
};
