export const GOOGLE_CLOUD_TYPE = process.env.TYPE as string;
export const GOOGLE_CLOUD_PROJECT_ID = process.env.PROJECT_ID as string;
export const GOOGLE_CLOUD_PRIVATE_KEY = process.env.PRIVATE_KEY!.replace(
  /\\n/g,
  '\n',
) as string;
export const GOOGLE_CLOUD_CLIENT_EMAIL = process.env.CLIENT_EMAIL as string;
export const GOOGLE_CLOUD_CLIENT_ID = process.env.CLIENT_ID as string;

export const PUBLIC_APP_NAME = process.env.PUBLIC_APP_NAME as string;
export const PUBLIC_APP_DESCRIPTION = process.env
  .PUBLIC_APP_DESCRIPTION as string;
