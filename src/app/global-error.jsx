"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error }) {
  useEffect(() => {
    try {
      throw new Error('message of throw new Error');
    }
    catch (err) {
      console.error(err);
      Sentry.captureException(err);
    }
  }, [error]);

  return (
    <div />
  );
}
