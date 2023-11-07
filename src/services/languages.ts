import {
  DEFAULT_LANGUAGES_CODE,
  supportedLanguages,
} from '@/configs/default-language';

import { APP_URL } from '@/configs/env.private';
import { Country } from '@/types/country';

export async function getSupportLanguages() {
  const response = await fetch(`${APP_URL}/api/languages`);
  const json = await response.json();
  return json.data as Country[];
}
export async function translateText(text: string, from?: string, to?: string) {
  if (!text || !from || !to || from === to || from === 'auto' || to === 'auto')
    return '';

  const response = await fetch(
    `${APP_URL}/api/languages/translate?query=${text}&from=${from}&to=${to}`,
  );
  const json = await response.json();
  return json.data as string;
}

export async function detectLanguage(text: string) {
  if (!text) return '';

  const response = await fetch(`${APP_URL}/api/languages/detect?query=${text}`);
  const json = await response.json();
  const language = json.data.language as string;
  const isSupported = supportedLanguages.some((lang) => lang.code === language);
  return isSupported ? language : DEFAULT_LANGUAGES_CODE.EN;
}
