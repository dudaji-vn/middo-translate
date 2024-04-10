import {
  DEFAULT_LANGUAGES_CODE,
  SUPPORTED_LANGUAGES,
} from '@/configs/default-language';

import { Country } from '@/types/country.type';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import toast from 'react-hot-toast';

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

  const body = {
    content: text,
    from,
    to,
  };
  const response = await fetch(
    `${NEXT_PUBLIC_URL}/api/languages/v2/translate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );
  try {
    const json = await response.json();
    return json.data;
  } catch (error) {
    toast.error("Content is too long, can't translate");
    return '';
  }
}

export async function detectLanguage(text: string) {
  try {
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
  } catch (error) {
    console.error('Error in detectLanguage', error);
    return DEFAULT_LANGUAGES_CODE.EN;
  }
}

export async function translateWithDetection(text: string, to: string) {
  if (!text || !to) return '';
  const from = await detectLanguage(text);
  return {
    detectedLanguage: from,
    translatedText: await translateText(text, from, to),
  };
}
