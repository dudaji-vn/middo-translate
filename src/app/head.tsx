import {
  NEXT_PUBLIC_DESCRIPTION,
  NEXT_PUBLIC_NAME,
} from '@/configs/env.public';

export default function Head() {
  return (
    <>
      <title>{NEXT_PUBLIC_NAME}</title>
      <meta name="description" content={NEXT_PUBLIC_DESCRIPTION} />
      <meta
        name="keywords"
        content="middo, middo translate, translate, korean, vietnam, english"
      />
      <meta property="og:url" content="http://middo.vercel.app" />
      <meta property="og:image" content="<generated>" />
      <meta property="og:image:type" content="<generated>" />
      <meta property="og:image:width" content="<generated>" />
      <meta property="og:image:height" content="<generated>" />
    </>
  );
}
