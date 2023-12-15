'use client';

import 'regenerator-runtime/runtime';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

import BootstrapProvider from './bootstrap';
import { CommonComponent } from './common-component';
import { Toaster as HotToaster } from 'react-hot-toast';
import React from 'react';
import { ReactQueryProvider } from './react-query';
import SocketProvider from './socket';
import { Toaster } from '@/components/toast';

type Props = {};

export const AppProvider = (props: Props & React.PropsWithChildren) => {
  return (
    <>
      <Toaster />
      <HotToaster />
      <SocketProvider />
      <BootstrapProvider />
      <CommonComponent />
      <ReactQueryProvider>{props.children}</ReactQueryProvider>
    </>
  );
};
