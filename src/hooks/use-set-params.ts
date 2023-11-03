import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useSetParams = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const setParams = (
    newParams: {
      key: string;
      value: string;
    }[],
  ) => {
    const params = new URLSearchParams(searchParams);
    newParams.forEach(({ key, value }) => {
      params.set(key, value);
    });
    replace(`${pathname}?${params.toString()}`);
  };
  const removeParams = (keys: string[]) => {
    const params = new URLSearchParams(searchParams);
    keys.forEach((key) => {
      params.delete(key);
    });
    replace(`${pathname}?${params.toString()}`);
  };

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    replace(`${pathname}?${params.toString()}`);
  };

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams);
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
  };
};
