import { textToSpeech } from '@/lib/cloud-voice';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('query') || '';
  const languageCode = searchParams.get('languageCode') || 'vi-VN';
  const [response] = await textToSpeech.synthesizeSpeech({
    input: { text },
    voice: { languageCode: languageCode },
    audioConfig: { audioEncoding: 'MP3' },
  });
  return Response.json({
    data: response,
  });
}
