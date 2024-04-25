"use client";

import { MainLayout } from "@/components/layout/main-layout"
import Image from "next/image"

function Error() {
	return <MainLayout>
        <div className="w-full mx-auto p-4 h-main-container-height flex items-center justify-center">
            <div>
                <Image 
                    src="/invalid_invitation.svg" 
                    alt="500" 
                    width={400} 
                    height={400} 
                />
            </div>
        </div>
  </MainLayout>
}

export default Error