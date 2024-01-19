import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useSetParams = () => {
  const searchParams = useSearchParams();
  const { replace, push } = useRouter();
  const pathname = usePathname();
  const setParams = (
    newParams: {
      key: string;
      value: string;
    }[],
  ) => {
    const params = new URLSearchParams(searchParams as URLSearchParams);
    newParams.forEach(({ key, value }) => {
      params.set(key, value);
    });
    replace(`${pathname}?${params.toString()}`);
  };
  const pushParams = (
    newParams: {
      key: string;
      value: string;
    }[],
  ) => {
    const params = new URLSearchParams(searchParams as URLSearchParams);
    newParams.forEach(({ key, value }) => {
      params.set(key, value);
    });
    push(`${pathname}?${params.toString()}`);
  };
  const removeParams = (keys: string[]) => {
    const params = new URLSearchParams(searchParams as URLSearchParams);
    keys.forEach((key) => {
      params.delete(key);
    });
    replace(`${pathname}?${params.toString()}`);
  };

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams as URLSearchParams);
    params.set(key, value);
    replace(`${pathname}?${params.toString()}`);
  };

  const pushParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams as URLSearchParams);
    params.set(key, value);
    push(`${pathname}?${params.toString()}`);
  };

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams as URLSearchParams);
    params.delete(key);
    replace(`${pathname}?${params.toString()}`);
  };
  return {
    setParams,
    searchParams,
    pathname,
    replace,
    removeParams,
    setParam,
    removeParam,
    pushParam,
    pushParams,
  };
};
