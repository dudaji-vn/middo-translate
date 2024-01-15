"use client";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error }) {
  useEffect(() => {
    console.error('Error in browser');
  }, [error]);

  return (
    <html>
      <body>
        <Error />
      </body>
    </html>
  );
}
