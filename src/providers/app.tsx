'use client';

import 'regenerator-runtime/runtime';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

import BootstrapProvider from './bootstrap';
import { CommonComponent } from './common-component';
import { ModalProvider } from './modal-provider';
import React from 'react';
import { ReactQueryProvider } from './react-query-provider';
import { SideEffectProvider } from './side-effect-provider';
import SocketProvider from './socket';
import { Toaster } from 'react-hot-toast';

type Props = {};

export const AppProvider = (props: Props & React.PropsWithChildren) => {
  return (
    <>
      <Toaster
        toastOptions={{
          error: {
            style: {
              background: '#F7D4D4',
              color: '#333',
              border: '1px solid #F33',
            },
          },
        }}
      />
      <SocketProvider />
      <BootstrapProvider />
      <CommonComponent />
      <ReactQueryProvider>{props.children}</ReactQueryProvider>
      <SideEffectProvider />
      <ModalProvider />
    </>
  );
};
