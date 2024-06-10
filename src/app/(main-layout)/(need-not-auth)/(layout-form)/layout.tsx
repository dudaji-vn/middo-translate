'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app.store';
import { PropsWithChildren } from 'react';

export default function LayoutForm({ children }: PropsWithChildren) {
    const isMobile = useAppStore((state) => state.isMobile);
  return (
    <div className="h-full relative">
      <div className="md:!bg-[url('/images/auth-background.jpg')] bg-cover bg-center fixed inset-0 z-[-1] "></div>
      <div className="flex justify-center items-center h-full">
        <div className='md:flex items-center justify-center flex-1 hidden'>
          <div className='max-w-[60%]'>
            <Image src="/images/login.png" alt="Logo" width={674} height={500}
            ></Image>
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
