
import { TBusinessExtensionData } from '@/app/(main-layout)/(protected)/business/settings/_components/extenstion/business-extension';
import { cookies } from 'next/headers';
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
  async getChatRoom(roomId: string, anonymousUserId: string) {
    try {
      const response = await fetch(
        `${this.basePath}/rooms/anonymous/${roomId}?userId=${anonymousUserId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
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
}
const businessAPI = new BusinessAPI();

export { businessAPI, BusinessAPI };
