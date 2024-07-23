import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="h-full w-full ">{children}</div>;
}
