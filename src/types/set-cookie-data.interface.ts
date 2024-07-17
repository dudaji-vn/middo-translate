import { CookieListItem } from "next/dist/compiled/@edge-runtime/cookies";

export default interface DataRequestSetCookie {
  key: string;
  value: string;
  time?: number;
  config?:  Partial<CookieListItem>
}
