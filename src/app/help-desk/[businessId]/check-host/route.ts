import { headers } from 'next/headers';

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      businessId: string;
    };
  },
) {
  const { searchParams } = new URL(request.url);
  const host = searchParams.get('host') || '';
  const businessId = params.businessId;
  console.log('---businessId', businessId);
  if (!host || !businessId) {
    return new Response('Host & business is required', { status: 400 });
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/help-desk/extensions/${businessId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    },
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  console.log('data', data);
  const domains = data?.data?.domains || [];
  const allowedDomain = domains.find((domain: string) =>
    domain?.includes(host),
  );
  console.log('data?.color', data.data?.color);
  if (allowedDomain) {
    return Response.json({
      data: {
        color: data.data?.color,
      },
    });
  }
  return Response.json(
    {
      data: 'NOT_ALLOWED',
    },
    { status: 400 },
  );
}
