"use client";

import { Typography } from "@/components/data-display";
import { MainLayout } from "@/components/layout/main-layout"
import Image from "next/image"
import { useTranslation } from "react-i18next";

function NotFoundPage() {
    const {t} = useTranslation('common')
	return <MainLayout>
        <div className="w-full mx-auto p-4 h-main-container-height flex flex-col items-center justify-center">
            <div>
                <Image 
                    src="/404.svg" 
                    alt="404" 
                    width={400} 
                    height={400} 
                />
            </div>
            <Typography variant={"h1"} className="text-3xl mt-10 text-neutral-400 text-center">
                {t('404.TITLE')}
            </Typography>
            <Typography variant={"h6"} className=" font-normal mt-3 text-neutral-600 text-center">
            {t('404.DESCRIPTION')}
            </Typography>
        </div>
  </MainLayout>
}

export default NotFoundPage