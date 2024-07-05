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
import { usePlatformStore } from '@/features/platform/stores';
import { EventListener } from './event-listener';
import { ToastProvider } from './toast.provider';
import { ThemeProvider } from './Theme.provider';
import MediaLightBoxProvider from './media-light-box.provider';

init({ data });

export const AppProvider = (props: Props & React.PropsWithChildren) => {
  const { user, isLoaded } = useAuthStore();
  const isMobile = usePlatformStore((state) => state.platform) === 'mobile';
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (user && isLoaded && pathname == ROUTE_NAMES.ROOT) {
      if (isMobile) {
        router.push(ROUTE_NAMES.TRANSLATION);
        return;
      }
      router.push(ROUTE_NAMES.ONLINE_CONVERSATION);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoaded, isMobile]);

  useEffect(() => {
    const stationId = user?.defaultStation?._id;
    if (
      isLoaded &&
      (pathname == ROUTE_NAMES.ONLINE_CONVERSATION ||
        pathname == ROUTE_NAMES.ROOT) &&
      stationId
    ) {
      router.push(`${ROUTE_NAMES.STATIONS}/${stationId}/conversations`);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?._id, user?.defaultStation?._id]);

  return (
    <ReactQueryProvider>
      <SocketProvider />
      <I18nextProvider i18n={i18next}>
        <Offline />
        <ToastProvider />
        <BootstrapProvider />
        <CommonComponent />
        <TooltipProvider>{props.children}</TooltipProvider>
        <ElectronProvider />
        <Suspense>
          <SideEffectProvider />
        </Suspense>
        <ModalProvider />
        <I18nInitProvider />
        <ThemeProvider />
        <MediaLightBoxProvider />
      </I18nextProvider>
      <ReactNativeProvider />
      <EventListener />
    </ReactQueryProvider>
  );
};
