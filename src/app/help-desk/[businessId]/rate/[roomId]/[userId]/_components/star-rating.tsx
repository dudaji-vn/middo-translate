'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import useClient from '@/hooks/use-client';
import { cn } from '@/utils/cn';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useParams, useRouter } from 'next/navigation';
import { TBusinessExtensionData } from '@/features/chat/help-desk/api/business.service';
import { endConversation } from '@/services/extension.service';
import StartAConversation from '@/app/help-desk/[businessId]/[...slugs]/_components/start-conversation/start-a-conversation';
import { LSK_VISITOR_ID, LSK_VISITOR_ROOM_ID } from '@/types/business.type';

const StarRating = ({
  onRate,
  extensionData,
  fromDomain,
}: {
  onRate: (star: number) => Promise<void>;
  extensionData?: TBusinessExtensionData;
  fromDomain: string;
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
  };

  const onEndConversation = async () => {
    localStorage.removeItem(LSK_VISITOR_ID);
    localStorage.removeItem(LSK_VISITOR_ROOM_ID);
    try {
      endConversation({
        roomId: String(params?.roomId),
        senderId: String(params?.userId),
      });
      if (!done) {
        router.push(
          `${ROUTE_NAMES.HELPDESK_CONVERSATION}/${params?.businessId}`,
        );
      }
    } catch (e) {
      console.log('err', e);
    }
  };

  const submitRating = async () => {
    try {
      setLoading(true);
      await onRate(star);
      setDone(true);
    } catch (e) {
      console.log('err', e);
    }
    onEndConversation();
    setLoading(false);
  };

  useEffect(() => {
    if (done && !extensionData)
      router.push(`${ROUTE_NAMES.HELPDESK_CONVERSATION}/${params?.businessId}`);
  }, [done, extensionData, params?.businessId, router]);

  if (!isMounted) return null;

  return (
    <>
      {done && extensionData && (
        <StartAConversation
          fromDomain={fromDomain}
          extensionData={extensionData}
          isAfterDoneAnCOnversation
        />
      )}
      <form
        action={action}
        className={cn(
          'm-auto flex h-full w-full max-w-screen-md flex-col items-center gap-4 px-6 py-10',
          {
            hidden: done,
          },
        )}
      >
        <Typography variant={'h2'} className="text-2xl">
          Rate us!
        </Typography>
        <Typography>
          Please spend your time to let us know your experience with this
          conversation
        </Typography>
        <div className="flex items-center gap-1 py-4 md:gap-3">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <button
                key={index}
                className={cn(
                  'bg-transparent p-2 transition-all duration-300  hover:-translate-y-[2px] hover:scale-110 ',
                  index + 1 <= star && 'scale-scale-110',
                  index + 1 > hoverStar && hoverStar !== 0 && 'scale-100',
                )}
                type="button"
                onClick={() => onRateStar(index + 1)}
                onMouseEnter={() => setHoverStar(index + 1)}
                onMouseLeave={() => setHoverStar(0)}
              >
                <Star
                  key={index}
                  size={30}
                  fill="#f0f0f0"
                  stroke="#f0f0f0"
                  className={cn(
                    ' transition-all duration-500  hover:fill-yellow-300 hover:stroke-yellow-300',
                    index + 1 <= star && 'fill-yellow-300 stroke-yellow-300',
                    index + 1 > hoverStar && hoverStar !== 0 && ' opacity-75',
                    index + 1 <= hoverStar &&
                      hoverStar !== 0 &&
                      'fill-yellow-300 stroke-yellow-300',
                  )}
                  style={{
                    transitionDelay:
                      index + 1 <= star || star === 0
                        ? `${index * 20}ms`
                        : `0ms !important`,
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
          onClick={submitRating}
          loading={loading}
        >
          Send Rating
        </Button>
        <Button
          variant="ghost"
          className="w-full hover:text-primary-700"
          shape={'square'}
          loading={loading}
          onClick={onEndConversation}
        >
          Skip
        </Button>
      </form>
    </>
  );
};
export default StarRating;
