import { NEXT_PUBLIC_URL } from '@/configs/env.public';

export async function textToSpeech(
  text: string,
  languageCode: string = 'en-US',
) {
  const response = await fetch(
    `${NEXT_PUBLIC_URL}/api/voices?query=${text}&languageCode=${languageCode}`,
  );
  const json = await response.json();
  return json.data.audioContent.data;
}
