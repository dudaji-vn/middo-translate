import { TSpace } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { FlowNode } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/steps/script-chat-flow/nested-flow';
import { NEXT_PUBLIC_API_URL } from '@/configs/env.public';
import { User } from '@/features/users/types';
import { DEFAULT_CLIENTS_PAGINATION } from '@/types/business-statistic.type';
import { cookies } from 'next/headers';
import { Edge } from 'reactflow';

export type Client = {
  firstConnectDate: string;
  lastConnectDate: string;
  _id: string;
  email: string;
  name: string;
};

export type AnalyticsFilterDate = {
  fromDate: string;
  toDate: string;
};
export type AnalyticsType = 'last-week' | 'last-month' | 'last-year' | 'custom';
export const analyticsType = ['last-week', 'last-month', 'last-year', 'custom'];
export type AnalyticsOptions = {
  type: AnalyticsType;
  spaceId: string;
} & (
  | {
      type: 'custom';
      custom: AnalyticsFilterDate;
    }
  | {
      type: Exclude<'last-week' | 'last-month' | 'last-year', 'custom'>;
      custom?: never;
    }
);
export type TBusinessExtensionData = {
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  domains: string[];
  user?: User;
  color: string;
  language: string;
  firstMessage: string;
  firstMessageEnglish: string;
  _id: string;
  chatFlow?: {
    nodes: FlowNode[];
    edges: Edge[];
  };
};
class BusinessAPI {
  private basePath: string;

  constructor(basePath: string = process.env.NEXT_PUBLIC_API_URL + '/api') {
    this.basePath = basePath;
  }

  async getAccessToken() {
    const cookieStore = cookies();
    const access_token = cookieStore.get('access_token')?.value;
    if (access_token) {
      return access_token;
    }
    const res = await fetch(NEXT_PUBLIC_API_URL + '/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieStore.get('refresh_token')?.value}`,
      },
    });
    const data = await res.json();
    return data?.accessToken || '';
  }

  async validateInvitation(verifyData: {
    token: string;
    status: 'accept' | 'decline';
  }) {
    const access_token = await this.getAccessToken();
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/api/help-desk/validate-invite',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(verifyData),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return true;
    } catch (error) {
      console.error('Error in accept invitation', error);
      return false;
    }
  }

  async getMyInvitations(): Promise<
    Array<{
      space: TSpace;
      email: string;
      verifyToken: string;
      invitedAt: string;
      isExpired: boolean;
    }>
  > {
    const access_token = await this.getAccessToken();
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/api/help-desk/my-invitations',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data?.data;
    } catch (error) {
      console.error('Error in get my invitation list', error);
      return [];
    }
  }
  async getSpaceBySpaceID(spaceId: string): Promise<
    | ({
        extension: TBusinessExtensionData;
      } & TSpace)
    | undefined
  > {
    const access_token = await this.getAccessToken();
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/api/help-desk/spaces/' + spaceId,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data?.data;
    } catch (error) {
      console.error('Error in getExtension', error);
      return undefined;
    }
  }
  async getExtensionByBusinessId(businessId: string) {
    try {
      const response = await fetch(
        `${this.basePath}/help-desk/extension/${businessId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache',
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data?.data;
    } catch (error) {
      console.error('Error in get business info', error);
      return undefined;
    }
  }

  async getChatRoom(roomId: string, anonymousUserId?: string) {
    let access_token = await this.getAccessToken();
    const path = anonymousUserId
      ? `${this.basePath}/rooms/anonymous/${roomId}?userId=${anonymousUserId}`
      : `${this.basePath}/rooms/${roomId}`;
    try {
      const response = await fetch(path, {
        method: 'GET',
        headers: anonymousUserId
          ? {
              'Content-Type': 'application/json',
            }
          : {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
            },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data?.data;
    } catch (error) {
      console.error('Error in get anonymous chat room', error);
      return undefined;
    }
  }

  async getAnalytics({ type = 'last-week', custom, spaceId }: AnalyticsOptions) {
    let access_token = await this.getAccessToken();
    try {
      if (!analyticsType.includes(type)) {
        throw new Error('Invalid analytics type');
      }
      if (type === 'custom' && !custom) {
        throw new Error('Invalid from date and to date');
      }
      const query = new URLSearchParams({
        type,
        spaceId,
        ...(custom && {
          fromDate: custom.fromDate,
          toDate: custom.toDate,
        }),
      }).toString();
      const path = `${this.basePath}/help-desk/analytics?${query}`;
      const response = await fetch(path, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data?.data;
    } catch (error) {
      console.error('Error in get analytics', error);
      return undefined;
    }
  }

  async getMyClients({
    search = '',
    limit = DEFAULT_CLIENTS_PAGINATION.limit,
    currentPage = DEFAULT_CLIENTS_PAGINATION.currentPage,
  }: {
    search: string;
    limit?: number;
    currentPage?: number;
  }): Promise<{
    items: Client[];
    totalPage: number;
  }> {
    const cookieStore = cookies();
    const path = `${this.basePath}/help-desk/my-clients?q=${search}&limit=${limit}&currentPage=${currentPage}`;
    try {
      const response = await fetch(path, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieStore.get('access_token')?.value}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data?.data;
    } catch (error) {
      console.error('Error in get My clients', error);
      return {
        items: [],
        totalPage: 0,
      };
    }
  }
  rateConversation = async ({
    star,
    businessId,
    userId,
  }: {
    star: number;
    businessId: string;
    userId: string;
  }) => {
    const rawFormData = {
      userId,
      businessId,
      star,
    };
    try {
      const path = `${this.basePath}/help-desk/rating`;
      const response = await fetch(path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rawFormData),
      });
      const data = await response.json();
      console.log('response', data);
      if (!response.ok) {
        throw new Error('Error in rate conversation');
      }
    } catch (error) {
      console.error('Error in rate conversation', error);
    }
  };
}
const businessAPI = new BusinessAPI();

export { businessAPI, BusinessAPI };
