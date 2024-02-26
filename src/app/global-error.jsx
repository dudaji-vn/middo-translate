"use client";

import { useEffect } from "react";

export default function GlobalError({ error }) {
  useEffect(() => {
    try {
      console.info('This is console log(info)');
      console.warn('This is console log(warn)');
      console.error('This is console log(error)');
      throw new Error('This is throw new Error');
    }
    catch (err) {
      console.error(err);
    }
  }, [error]);

  return (
    <div />
  );
}
