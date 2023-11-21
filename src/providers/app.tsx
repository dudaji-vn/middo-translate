'use client';

import 'regenerator-runtime/runtime';

import React from 'react';
import SocketProvider from './socket';
import { Toaster } from '@/components/toast';

type Props = {};

export const AppProvider = (props: Props & React.PropsWithChildren) => {
  return (
    <>
      <SocketProvider />
      {props.children}
      <Toaster />
    </>
  );
};
