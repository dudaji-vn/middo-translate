import React from 'react';
import StarRating from './_components/star-rating';
import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { notFound } from 'next/navigation';

const RatingPage = async ({
  params,
  searchParams: { originReferer },
}: {
  params: {
    businessId: string;
    userId: string;
  };
  searchParams: {
    originReferer: string;
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

  return (
    <StarRating
      fromDomain={originReferer}
      onRate={rateConversation}
      extensionData={extensionData}
    />
  );
};

export default RatingPage;
