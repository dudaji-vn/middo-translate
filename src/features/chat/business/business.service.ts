import { TBusinessExtensionData } from '@/app/(main-layout)/(protected)/business/settings/_components/extenstion/business-extension';
import { cookies } from 'next/headers';

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

  async getMyClients({ search = '' }: { search: string }) {
    const cookieStore = cookies();
    const path = `${this.basePath}/help-desk/my-clients?q=${search || ''}`;
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
      return [];
    }
  }

}
const businessAPI = new BusinessAPI();

export { businessAPI, BusinessAPI };
