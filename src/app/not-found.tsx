"use client";

import { MainLayout } from "@/components/layout/main-layout"
import Image from "next/image"

function NotFoundPage() {
	return <MainLayout>
        <div className="w-full mx-auto p-4 h-main-container-height flex items-center justify-center">
            <div>
                <Image 
                    src="/404.svg" 
                    alt="404" 
                    width={400} 
                    height={400} 
                />
            </div>
        </div>
  </MainLayout>
}

export default NotFoundPage