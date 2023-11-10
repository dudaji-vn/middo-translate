import { textToSpeech } from '@/lib/cloud-voice';

export async function GET(request: Request) {
  const [response] = await textToSpeech.listVoices();
  return Response.json({
    data: response,
  });
}
