import { axios } from '@/lib/axios';
import { Response } from '@/types';
import { Station } from '../types/station.types';

const basePath = '/stations';
export const stationApi = {
  async getStationById(stationId: string): Promise<Station> {
    const response = await axios.get(`${basePath}/${stationId}`);
    return response.data;
  },
  async updateStation({
    stationId,
    data,
  }: {
    stationId: string;
    data: Partial<Station>;
  }): Promise<Response<Station>> {
    const response = await axios.patch(`${basePath}/${stationId}`, data);
    return response.data;
  },
  async leaveStation(stationId: string): Promise<Response<Station>> {
    const response = await axios.delete(
      `${basePath}/${stationId}/members/leave`,
    );
    return response.data;
  },
};
