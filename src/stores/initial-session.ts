'use client';

import { useRef } from 'react';
import { useSessionStore } from './session';

interface InitializeSessionStoreProps {
  sessionId: string;
}

export const InitializeSessionStore = ({
  sessionId,
}: InitializeSessionStoreProps) => {
  const initialized = useRef(false);
  if (initialized.current) return null;
  useSessionStore.setState({ sessionId });
  initialized.current = true;
  return null;
};
