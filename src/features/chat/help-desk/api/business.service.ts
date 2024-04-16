import { FlowNode } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/business/settings/_components/extension-creation/steps/script-chat-flow/nested-flow';
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
  async getExtension(): Promise<TBusinessExtensionData | undefined> {
    const cookieStore = cookies();
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/api/help-desk/my-business',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookieStore.get('access_token')?.value}`,
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
  async getChatRoom(roomId: string, anonymousUserId?: string) {
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
              Authorization: `Bearer ${cookies().get('access_token')?.value}`,
            },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data?.data;
    } catch (error) {
      console.error('Error in get business info :>>', error);
      return undefined;
    }
  }
  async getBusinessInfomation(businessId: string) {
    try {
      const response = await fetch(
        `${this.basePath}/help-desk/business/${businessId}`,
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
  async getMyBusiness() {
    const cookieStore = cookies();
    try {
      const response = await fetch(`${this.basePath}/help-desk/my-business`, {
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
      console.error('Error in get My business info', error);
      return undefined;
    }
  }
  async getAnalytics({ type = 'last-week', custom }: AnalyticsOptions) {
    const cookieStore = cookies();
    try {
      if (!analyticsType.includes(type)) {
        throw new Error('Invalid analytics type');
      }
      if (type === 'custom' && !custom) {
        throw new Error('Invalid from date and to date');
      }
      const query = new URLSearchParams({
        type,
        ...(custom && {
          fromDate: custom.fromDate,
          toDate: custom.toDate,
        }),
      }).toString();
      const path = `${this.basePath}/help-desk/analytics?${query}`;
      console.log('type-path', type, path);
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
