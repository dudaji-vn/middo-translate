'use client';

import 'regenerator-runtime/runtime';

import { NextAuthProvider } from './next-auth';
import React from 'react';
import { ReactQueryProvider } from './react-query';
import SocketProvider from './socket';
import { Toaster } from '@/components/feedback/toast';

type Props = {};

export const AppProvider = (props: Props & React.PropsWithChildren) => {
  return (
    <>
      <Toaster />
      <SocketProvider />
      <ReactQueryProvider>
        <NextAuthProvider>{props.children}</NextAuthProvider>
      </ReactQueryProvider>
    </>
  );
};
