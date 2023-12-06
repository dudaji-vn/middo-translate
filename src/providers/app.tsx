'use client';

import 'regenerator-runtime/runtime';

import { NextAuthProvider } from './next-auth';
import React from 'react';
import { ReactQueryProvider } from './react-query';
import SocketProvider from './socket';
import { Toaster } from '@/components/toast';
import BootstrapProvider from './bootstrap';

type Props = {};

export const AppProvider = (props: Props & React.PropsWithChildren) => {
  return (
    <>
      <Toaster />
      <SocketProvider />
      <BootstrapProvider />
      <ReactQueryProvider>
        <NextAuthProvider>{props.children}</NextAuthProvider>
      </ReactQueryProvider>
    </>
  );
};
