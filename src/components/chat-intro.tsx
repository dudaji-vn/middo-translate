'use client';
import { useTranslation } from 'react-i18next';
import { Typography } from './data-display';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './data-display/carousel';
import Image from 'next/image';

export interface ChatIntroProps {}

export const ChatIntro = (props: ChatIntroProps) => {
  const { t } = useTranslation('common');

  return (
    <>
      <div className="flex-col items-center justify-center py-10 text-center">
        <Typography variant="h6" className="text-center text-lg  text-primary">
          {t('CONVERSATION.EMPTY_WELCOME_TITLE')}
        </Typography>
      </div>
      <div className="flex items-center justify-center">
        <Carousel opts={{ loop: true }} className="max-w-xl">
          <CarouselContent>
            <CarouselItem className="overflow-hidden">
              <CardItem
                title={t('CONVERSATION.EMPTY_WELCOME_ITEM_1_TITLE')}
                description={t('CONVERSATION.EMPTY_WELCOME_ITEM_1_DESCRIPTION')}
                image="/landing-page/conversation.png"
              />
            </CarouselItem>
            <CarouselItem>
              <CardItem
                title={t('CONVERSATION.EMPTY_WELCOME_ITEM_2_TITLE')}
                description={t('CONVERSATION.EMPTY_WELCOME_ITEM_2_DESCRIPTION')}
                image="/landing-page/middo-call.png"
              />
            </CarouselItem>
            <CarouselItem>
              <CardItem
                title={t('CONVERSATION.EMPTY_WELCOME_ITEM_3_TITLE')}
                description={t('CONVERSATION.EMPTY_WELCOME_ITEM_3_DESCRIPTION')}
                image="/editor.png"
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </Carousel>
      </div>
    </>
  );
};

const CardItem = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) => (
  <div className="flex flex-col items-center justify-center ">
    <Image
      alt={title}
      src={image}
      quality={100}
      width={600}
      height={520}
      priority
      className="max-h-[50vh] object-contain"
    />
    <Typography variant="h4" className="mt-6 text-primary">
      {title}
    </Typography>
    <Typography
      variant="muted"
      className="mt-2 overflow-hidden text-center text-neutral-600"
    >
      {description}
    </Typography>
  </div>
);
