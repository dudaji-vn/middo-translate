import React from 'react';
import StarRating from './_components/star-rating';
import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getAllowedDomain } from '@/utils/allowed-domains';

const RatingPage = async ({
  params,
}: {
  params: {
    businessId: string;
    userId: string;
  };
}) => {
  const extensionData = await businessAPI.getExtensionByBusinessId(
    params.businessId,
  );
  if (!extensionData) {
    notFound();
  }
  async function rateConversation(star: any) {
    'use server';

    const formData = {
      userId: params.userId,
      businessId: params.businessId,
      star: star,
    };
    businessAPI.rateConversation(formData).catch((err) => {
      console.log('err', err);
    });
  }

  const headersList = headers();
  const referer = headersList.get('referer');
  const allowedDomain = getAllowedDomain({
    refer: referer,
    allowedDomains: extensionData.domains,  
  });
  return (
    <StarRating
      fromDomain={allowedDomain as string}
      onRate={rateConversation}
      extensionData={extensionData}
    />
  );
};

export default RatingPage;