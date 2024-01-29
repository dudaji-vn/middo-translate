import { jwtDecode } from 'jwt-decode';
export const getTokenMaxAge = (token: string) => {
  const { exp: tokenExp } = jwtDecode(token);
  const now = Date.now();
  const exp = tokenExp! * 1000;
  const maxAge = exp - now;
  return maxAge;
};
