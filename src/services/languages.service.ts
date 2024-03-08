import {
  DEFAULT_LANGUAGES_CODE,
  SUPPORTED_LANGUAGES,
} from '@/configs/default-language';

import { Country } from '@/types/country.type';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';

export async function getSupportLanguages() {
  const response = await fetch(`${NEXT_PUBLIC_URL}/api/languages`);
  const json = await response.json();
  return json.data as Country[];
}
export async function translateText(text: string, from?: string, to?: string) {
  if (!text || !from || !to || from === 'auto' || to === 'auto') return '';
  // if not in supported languages, return text
  const isFromSupported = SUPPORTED_LANGUAGES.some(
    (lang) => lang.code === from,
  );
  const isToSupported = SUPPORTED_LANGUAGES.some((lang) => lang.code === to);
  if (!isFromSupported || !isToSupported) return text;

  if (from === to) return text;

  const textEncoded = encodeURIComponent(text);

  const response = await fetch(
    `${NEXT_PUBLIC_URL}/api/languages/translate-cache?query=${textEncoded}&from=${from}&to=${to}`,
  );
  try {
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error('Error in translateText', error);
    return '';
  }
}

export async function detectLanguage(text: string) {
  if (!text) return '';

  const response = await fetch(
    `${NEXT_PUBLIC_URL}/api/languages/detect?query=${text}`,
  );
  const json = await response.json();
  const language = json.data.language as string;
  const isSupported = SUPPORTED_LANGUAGES.some(
    (lang) => lang.code === language,
  );
  return isSupported ? language : DEFAULT_LANGUAGES_CODE.EN;
}

export async function translateWithDetection(text: string, to: string) {
  if (!text || !to) return '';
  const from = await detectLanguage(text);
  return {
    detectedLanguage: from,
    translatedText: await translateText(text, from, to),
  };
}
