'use client';

import 'regenerator-runtime/runtime';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

import BootstrapProvider from './bootstrap.provider';
import { CommonComponent } from './common-component.provider';
import { ModalProvider } from './modal.provider';
import React, { Suspense, useEffect } from 'react';
import { ReactQueryProvider } from './react-query.provider';
import { SideEffectProvider } from './side-effect.provider';
import SocketProvider from './socket.provider';
import { Toaster } from 'react-hot-toast';
import { TooltipProvider } from '@/components/data-display/tooltip';
import ElectronProvider from './electron.provider';
import { I18nextProvider } from 'react-i18next';
import i18next from '@/lib/i18n/config';
type Props = {};

import data from '@emoji-mart/data';
import { init } from 'emoji-mart';
import Offline from '@/components/modal/offline';
import { I18nInitProvider } from './I18nInit.provider';
import { useAuthStore } from '@/stores/auth.store';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { ReactNativeProvider } from './react-native.provider';
init({ data });

export const AppProvider = (props: Props & React.PropsWithChildren) => {
  const { user, isLoaded } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if(user && isLoaded && pathname == ROUTE_NAMES.ROOT) {
      router.push(ROUTE_NAMES.ONLINE_CONVERSATION);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoaded]);
  return (
    <>
      <I18nextProvider i18n={i18next}>
        <Offline />
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
        <TooltipProvider>
          <ReactQueryProvider>{props.children}</ReactQueryProvider>
        </TooltipProvider>
        <ElectronProvider />
        <Suspense>
          <SideEffectProvider />
        </Suspense>
        <ModalProvider />
        <I18nInitProvider />
      </I18nextProvider>
      <ReactNativeProvider />
    </>
  );
};
