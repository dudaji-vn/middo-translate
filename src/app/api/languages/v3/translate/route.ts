type DataResponse = {
  data: string;
};
export async function POST(request: Request) {
  const body = await request.json();
  const text = body.content || '';
  const from = body.from || 'vi';
  const to = body.to || 'en';
  const url = 'https://translate.stage.dudaji.com/api/v1/language/translate/v2';
  const headers = {
    accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const data = {
    target: to,
    q: [text],
  };
  if (!text) {
    return Response.json({
      data: '',
    });
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  const result = json.data.translations[0].translatedText;
  return Response.json({
    data: result,
  });
}
