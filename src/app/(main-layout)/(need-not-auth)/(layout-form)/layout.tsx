'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app.store';
import { PropsWithChildren } from 'react';

export default function LayoutForm({ children }: PropsWithChildren) {
    const isMobile = useAppStore((state) => state.isMobile);
  return (
    <div className="h-full relative">
      <div className="bg-primary-200 fixed inset-0 z-[-1] "></div>
      <div className="flex justify-center items-center h-full">
        <div className='md:flex justify-center h-full items-end flex-1 hidden'>
          <div className='mx-auto w-full relative'>
            <Image src="/images/auth-background.png" alt="Logo" width={1000} height={1000} className='w-full mx-auto max-w-[1000px]'></Image>
          </div>
        </div>
        <motion.div
            layout
            transition={{ delay: 0.5 }}
            initial={{ width: 0, opacity: 0}}
            animate={{ width: isMobile ? '100%' : 400, opacity: 1}}
            exit={{ width: 0, opacity: 0}}
            className='bg-white h-full overflow-auto w-full md:w-[400px] dark:bg-background border-l dark:border-neutral-900'>
            <div className="p-5 pt-12">
                {children}
            </div>
        </motion.div>
      </div>
    </div>
  );
}
