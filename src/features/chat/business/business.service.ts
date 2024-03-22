
import { cookies } from 'next/headers';

export type Client = {
  firstConnectDate: string
  lastConnectDate: string
  _id: string
  email: string
  name: string
}
export const DEFAULT_CLIENTS_PAGINATION = {
  limit: 50,
  currentPage: 1
}
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
  color: string;
  language: string;
  firstMessage: string;
  firstMessageEnglish: string;
  _id: string;
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
      const cookieStore = cookies();
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
    const path = `${this.basePath}/help-desk/my-clients?q=${search}&limit=${limit}&page=${currentPage}`;
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
}
const businessAPI = new BusinessAPI();

export { businessAPI, BusinessAPI };
