'use client';

import {
  TConversationTag,
  TSpace,
} from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { Globe } from 'lucide-react';
import { CircleFlag } from 'react-circle-flags';
import { getContrastingTextColor } from './color-generator';
import { getCountryCode } from './language-fn';
import { SpaceInboxFilterState } from '@/stores/space-inbox-filter.store';
import { isEmpty } from 'lodash';

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
            countryCode={getCountryCode(code) || code}
            height={20}
            width={20}
          />
        ),
      })) || [],
    tags: data?.tags?.map(({ _id, name, color }: TConversationTag) => ({
      value: _id,
      label: name,
      props: {
        style: {
          backgroundColor: color,
          color: getContrastingTextColor(color),
        },
      },
    })),
  };
};

export const convertRoomsFilterOptionsToString = (filterOptions?: {
  domains?: string[];
  countries?: string[];
  tags?: string[];
}) => {
  if (!filterOptions) {
    return {};
  }
  return Object.entries(filterOptions).reduce(
    (acc, [key, value]) => {
      if (isEmpty(value)) {
        return acc;
      } else {
        acc[key] = value.join(',');
        return acc;
      }
    },
    {} as Record<string, string>,
  );
};
