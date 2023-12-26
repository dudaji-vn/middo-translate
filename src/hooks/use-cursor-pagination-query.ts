import { BaseEntity, CursorPagination, ListResponse } from '@/types';
import {
  QueryFunction,
  QueryKey,
  UseInfiniteQueryOptions,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { deepCopy } from '@/utils/deep-copy';

type TDataResponse<T> = ListResponse<T, CursorPagination>;

type TypeWithBaseEntity<T> = T & BaseEntity;

type CursorPaginationQuery<TData> = {
  queryFn: QueryFunction<TDataResponse<TData>>;
  queryKey: QueryKey;
  config?: UseInfiniteQueryOptions<TDataResponse<TData>>;
};

export const useCursorPaginationQuery = <TData>({
  queryKey,
  queryFn,
  config,
}: CursorPaginationQuery<TData>) => {
  const { data, ...rest } = useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam: (lastPage) => {
      if (lastPage.pageInfo.hasNextPage) {
        return lastPage.pageInfo.endCursor;
      }
      return undefined;
    },
    ...config,
  });

  const queryClient = useQueryClient();

  const addItem = useCallback(
    (item: TypeWithBaseEntity<TData>) => {
      queryClient.setQueryData<typeof data | undefined>(queryKey, (old) => {
        const oldDeepCopy = deepCopy(old) as typeof data;
        const newPage: TDataResponse<TData> = {
          pageInfo: {
            endCursor: item._id,
            hasNextPage: false,
          },
          items: [deepCopy(item)],
        };

        if (!oldDeepCopy) {
          return {
            pageParams: [item._id],
            pages: [newPage],
          };
        }
        return {
          ...oldDeepCopy,
          pages: [newPage, ...oldDeepCopy.pages],
        };
      });
    },
    [queryClient, queryKey],
  );

  const replaceItem = useCallback(
    (_item: TypeWithBaseEntity<TData>, replaceId: string) => {
      queryClient.setQueryData<typeof data | undefined>(queryKey, (old) => {
        const oldDeepCopy = deepCopy(old) as typeof data;
        if (!oldDeepCopy) return oldDeepCopy;
        let hasReplace = false;
        const newPage = oldDeepCopy?.pages.map((page) => {
          return {
            ...page,
            items: page.items.map((item) => {
              const itemWithBaseEntity = item as TypeWithBaseEntity<TData>;
              if (itemWithBaseEntity._id === replaceId) {
                hasReplace = true;
                return {
                  ...item,
                  ..._item,
                };
              }
              return item;
            }),
          };
        });
        if (!hasReplace) {
          newPage.unshift({
            pageInfo: {
              endCursor: _item._id,
              hasNextPage: false,
            },
            items: [deepCopy(_item)],
          });
        }
        return {
          ...oldDeepCopy,
          pages: newPage,
        };
      });
    },
    [queryClient, queryKey],
  );

  const updateItem = useCallback(
    (_item: TypeWithBaseEntity<TData>) => {
      queryClient.setQueryData<typeof data | undefined>(queryKey, (old) => {
        const oldDeepCopy = deepCopy(old) as typeof data;
        if (!oldDeepCopy) return oldDeepCopy;
        const newPage = oldDeepCopy?.pages.map((page) => {
          return {
            ...page,
            items: page.items.map((item) => {
              const itemWithBaseEntity = item as TypeWithBaseEntity<TData>;
              if (itemWithBaseEntity._id === _item._id) {
                return {
                  ...item,
                  ..._item,
                };
              }
              return item;
            }),
          };
        });
        return {
          ...oldDeepCopy,
          pages: newPage,
        };
      });
    },
    [queryClient, queryKey],
  );

  const removeItem = useCallback(
    (removeId: string) => {
      queryClient.setQueryData<typeof data | undefined>(queryKey, (old) => {
        const oldDeepCopy = deepCopy(old) as typeof data;
        if (!oldDeepCopy) return oldDeepCopy;
        const newPage = oldDeepCopy?.pages.map((page) => {
          return {
            ...page,
            items: page.items.filter((item) => {
              const itemWithBaseEntity = item as TypeWithBaseEntity<TData>;
              return itemWithBaseEntity._id !== removeId;
            }),
          };
        });
        return {
          ...oldDeepCopy,
          pages: newPage,
        };
      });
    },
    [queryClient, queryKey],
  );

  const items = useMemo(() => {
    const dataDeepCopy = deepCopy(data) as typeof data;
    return dataDeepCopy?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);
  return {
    ...rest,
    items,
    addItem,
    replaceItem,
    updateItem,
    removeItem,
  };
};
