'use client';

import 'regenerator-runtime/runtime';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

import BootstrapProvider from './bootstrap';
import { CommonComponent } from './common-component';
import { FCMProvider } from './fcm.provider';
import { Toaster as HotToaster } from 'react-hot-toast';
import React from 'react';
import { ReactQueryProvider } from './react-query';
import { SideEffectProvider } from './side-effect.provider';
import SocketProvider from './socket';

type Props = {};

export const AppProvider = (props: Props & React.PropsWithChildren) => {
  return (
    <>
      <HotToaster />
      <SocketProvider />
      <BootstrapProvider />
      <CommonComponent />
      <ReactQueryProvider>{props.children}</ReactQueryProvider>
      {/* <FCMProvider /> */}
      <SideEffectProvider />
    </>
  );
};
