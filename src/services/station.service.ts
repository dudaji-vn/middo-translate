// client side functions

import { axios } from '@/lib/axios';
import { get, patch, post, put } from './api.service';
import { Member } from '@/app/(main-layout)/(protected)/stations/station-crud/sections/members-columns';

export const createStation = (data: {
  name: string;
  avatar?: string;
  backgroundImage?: string;
  members?: Member[];
}) => {
  return post('/stations', data);
};

export const getStations = (type: 'joined-stations' | undefined | null) => {
  const queryParams = type ? `?type=${type}` : '';
  return get(`/stations` + queryParams);
};

export const validateStationInvitation = (data: {
  token: string;
  status: 'accept' | 'decline';
}) => {
  return post('/stations/members/validate-invite', data);
};

export const setDefaultStation = (stationId: string) => {
  return patch(`/stations/${stationId}/set-default`, null);
};

export const deleteStation = (stationId: string) => {
  return axios.delete(`/stations/${stationId}`);
};
