'use client';

import {
  TConversationTag,
  TSpace,
} from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { Globe } from 'lucide-react';
import { CircleFlag } from 'react-circle-flags';
import { getContrastingTextColor } from './color-generator';
import { LANGUAGE_CODES_MAP } from '@/configs/default-language';

export const getRoomsFilterOptionsFromSpace = (data: TSpace) => {
  return {
    domains:
      data?.extension?.domains?.map((domain: string) => ({
        value: domain,
        icon: <Globe size={16} />,
      })) || [],
    countries:
      data?.countries?.map((code: string) => ({
        value: code,
        icon: (
          <CircleFlag
            countryCode={
              LANGUAGE_CODES_MAP[code as keyof typeof LANGUAGE_CODES_MAP]
            }
            height={20}
            width={20}
          />
        ),
      })) || [],
    tags: data?.tags?.map(({ name, color }: TConversationTag) => ({
      value: name,
      props: {
        style: {
          backgroundColor: color,
          color: getContrastingTextColor(color),
        },
      },
    })),
  };
};
