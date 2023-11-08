'use client';

import 'regenerator-runtime/runtime';

import React from 'react';
import { Toaster } from '@/components/toast';

type Props = {};

export const AppProvider = (props: Props & React.PropsWithChildren) => {
  return (
    <>
      {props.children}
      <Toaster />
    </>
  );
};
