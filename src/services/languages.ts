import {
  DEFAULT_LANGUAGES_CODE,
  supportedLanguages,
} from '@/configs/default-language';

import { Country } from '@/types/country';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';

export async function getSupportLanguages() {
  const response = await fetch(`${NEXT_PUBLIC_URL}/api/languages`);
  const json = await response.json();
  return json.data as Country[];
}
export async function translateText(text: string, from?: string, to?: string) {
  if (!text || !from || !to || from === 'auto' || to === 'auto') return '';

  // if not in supported languages, return text
  const isFromSupported = supportedLanguages.some((lang) => lang.code === from);
  const isToSupported = supportedLanguages.some((lang) => lang.code === to);
  if (!isFromSupported || !isToSupported) return text;

  if (from === to) return text;

  const response = await fetch(
    `${NEXT_PUBLIC_URL}/api/languages/translate?query=${text}&from=${from}&to=${to}`,
  );
  const json = await response.json();
  return json.data as string;
}

export async function detectLanguage(text: string) {
  if (!text) return '';

  const response = await fetch(
    `${NEXT_PUBLIC_URL}/api/languages/detect?query=${text}`,
  );
  const json = await response.json();
  const language = json.data.language as string;
  const isSupported = supportedLanguages.some((lang) => lang.code === language);
  return isSupported ? language : DEFAULT_LANGUAGES_CODE.EN;
}
