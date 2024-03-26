'use client'

import { Button } from "@/components/actions";
import { Typography } from "@/components/data-display";
import useClient from "@/hooks/use-client";
import { cn } from "@/utils/cn";
import { Star } from "lucide-react";
import { useState } from "react";
import StartAConversation from "../../../[...slugs]/_components/start-conversation/start-a-conversation";
import Link from "next/link";
import { ROUTE_NAMES } from "@/configs/route-name";
import { useParams, useRouter } from "next/navigation";
import { TBusinessExtensionData } from "@/features/chat/help-desk/api/business.service";

const StarRating = ({ onRate, businessData }: {
    onRate: (star: number) => Promise<void>
    businessData?: TBusinessExtensionData
}) => {
    const isMounted = useClient();
    const [hoverStar, setHoverStar] = useState(0);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [done, setDone] = useState(false);
    const [star, setStar] = useState(0);
    const action = onRate.bind(null, star);
    const onRateStar = (star: number) => {
        setStar(star);
        setHoverStar(0);
    }

    if (!isMounted) return null;

    if (done) {
        if (businessData) {
            return <StartAConversation businessData={businessData} isAfterDoneAnCOnversation />
        }
        else router.push(`${ROUTE_NAMES.HELPDESK_CONVERSATION}/${params?.businessId}`)

    }
    return (<>
        <form action={action} className="max-w-screen-md w-full px-6 m-auto flex flex-col gap-8 items-center">
            <Typography variant={'h2'} className="text-2xl">Rate us!</Typography>
            <Typography >Please spend your time to let us know your experience with this conversation</Typography>
            <div className='flex items-center md:gap-3 gap-1'>
                {Array(5).fill(0).map((_, index) => (
                    <button
                        key={index}
                        className={cn("bg-transparent p-2 hover:-translate-y-[2px] hover:scale-110  duration-300 transition-all ",
                            index + 1 <= star && 'scale-scale-110',
                            index + 1 > hoverStar && hoverStar !== 0 && 'scale-100')}
                        type="button"
                        onClick={() => onRateStar(index + 1)}
                        onMouseEnter={() => setHoverStar(index + 1)}
                        onMouseLeave={() => setHoverStar(0)}
                    >
                        <Star
                            key={index}
                            size={30}
                            fill='#f0f0f0'
                            stroke='#f0f0f0'
                            className={cn(" hover:stroke-yellow-300 hover:fill-yellow-300  duration-500 transition-all", index + 1 <= star && 'fill-yellow-300 stroke-yellow-300',
                                index + 1 > hoverStar && hoverStar !== 0 && ' opacity-75',
                                index + 1 <= hoverStar && hoverStar !== 0 && 'fill-yellow-300 stroke-yellow-300'
                            )}
                            style={{
                                transitionDelay: index + 1 <= star || star === 0 ? `${index * 20}ms` : `0ms !important`,
                            }}
                        />
                    </button>
                ))}
            </div>
            <Button
                type="submit"
                variant="default"
                className="w-full"
                shape={'square'}
                disabled={star === 0}
                onClick={() => {
                    setLoading(true)
                    onRate(star).then(() => {
                        setLoading(false)
                        setDone(true)
                    })
                }}
                loading={loading}
            >
                Send Rating
            </Button>
            <Link href={`${ROUTE_NAMES.BUSINESS_CONVERSATION}/${params?.businessId}`} >
                Skip
            </Link>
        </form></>
    );
};
export default StarRating