import { axios } from '@/lib/axios';
import { Response } from '@/types';
import { InvitationLink, Station } from '../types/station.types';
import { User } from '@/features/users/types';

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
  async checkIsActiveLinkInvitation(stationId: string): Promise<boolean> {
    const response = await axios.get(
      `${basePath}/${stationId}/invitation/active`,
    );
    return response.data;
  },
  async activeLinkInvitation(stationId: string): Promise<Response<Station>> {
    const response = await axios.post(
      `${basePath}/${stationId}/members/invitation-link`,
    );
    return response.data;
  },
  async cancelLinkInvitation(stationId: string): Promise<Response<Station>> {
    const response = await axios.delete(
      `${basePath}/${stationId}/members/invitation-link`,
    );
    return response.data;
  },
  async getInvitationLink(stationId: string): Promise<InvitationLink> {
    const response = await axios.get(
      `${basePath}/${stationId}/members/invitation-link`,
    );
    return response.data;
  },
  async inviteMembers({
    stationId,
    users,
  }: {
    stationId: string;
    users: Partial<User>[];
  }): Promise<Response<Station>> {
    const response = await axios.post(`${basePath}/${stationId}/members`, {
      members: users,
    });
    return response.data;
  },
  async inviteMembersByUserId({
    stationId,
    users,
  }: {
    stationId: string;
    users: Partial<User>[];
  }): Promise<Station> {
    const response = await axios.post(
      `${basePath}/${stationId}/members/users`,
      {
        members: users.map((user) => {
          return {
            userId: user._id,
          };
        }),
      },
    );
    return response.data;
  },
  async joinByInvitationLink({
    stationId,
    link,
  }: {
    stationId: string;
    link: string;
  }): Promise<Station> {
    const response = await axios.post(
      `${basePath}/${stationId}/members/invitation-link/join`,
      {
        link,
      },
    );
    return response.data;
  },
  async removeMember({
    stationId,
    userId,
  }: {
    stationId: string;
    userId: string;
  }): Promise<Response<Station>> {
    const response = await axios.delete(`${basePath}/${stationId}/members`);
    return response.data;
  },
};
