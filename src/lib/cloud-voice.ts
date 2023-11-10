import {
  GOOGLE_CLOUD_CLIENT_EMAIL,
  GOOGLE_CLOUD_CLIENT_ID,
  GOOGLE_CLOUD_PRIVATE_KEY,
  GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_CLOUD_TYPE,
} from '@/configs/env.private';

import { TextToSpeechClient } from '@google-cloud/text-to-speech';
export const textToSpeech = new TextToSpeechClient({
  credentials: {
    type: GOOGLE_CLOUD_TYPE,
    project_id: GOOGLE_CLOUD_PROJECT_ID,
    private_key: GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: GOOGLE_CLOUD_CLIENT_EMAIL,
    client_id: GOOGLE_CLOUD_CLIENT_ID,
  },
  projectId: GOOGLE_CLOUD_PROJECT_ID,
});
