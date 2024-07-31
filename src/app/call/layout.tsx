'use client';

import { VideoCallCommonModal } from "@/features/call/components/common/modal";

export default function CallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>
    <VideoCallCommonModal />
    {children}
  </>;
}
