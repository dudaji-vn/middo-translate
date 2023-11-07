'use client';

import 'regenerator-runtime/runtime';

import React from 'react';

type Props = {};

export const AppProvider = (props: Props & React.PropsWithChildren) => {
  return <>{props.children}</>;
};
