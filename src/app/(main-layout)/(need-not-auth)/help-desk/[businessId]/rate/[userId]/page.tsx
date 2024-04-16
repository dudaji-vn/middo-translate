import React from 'react'
import StarRating from './_components/star-rating'
import { businessAPI } from '@/features/chat/help-desk/api/business.service'
import { notFound } from 'next/navigation'



const RatingPage = async ({ params }: {
    params: {
        businessId: string
        userId: string
    }
}) => {
    const businessData = await businessAPI.getSpaceInformation(params.businessId);
    if (!businessData) {
        notFound();
    }
    async function rateConversation(star: any) {
        'use server'

        const formData = {
            userId: params.userId,
            businessId: params.businessId,
            star: star
        }
        businessAPI.rateConversation(formData).catch((err) => {
            console.log('err', err)
        })
    }
    return (
        <StarRating onRate={rateConversation} businessData={businessData} />
    )
}

export default RatingPage