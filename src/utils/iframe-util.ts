'use client';

export const announceToParent = (message: string | Record<string, unknown>) => {
  if (typeof window === 'undefined') return;
  window.parent.postMessage(message, '*');
};
