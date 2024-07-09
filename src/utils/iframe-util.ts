'use client';

export const announceToParent = (message: string) => {
  if (typeof window === 'undefined') return;
  window.parent.postMessage(message, '*');
};
