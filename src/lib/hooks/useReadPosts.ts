'use client';

import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import type { TPosts } from '../types';

const useReadPosts = (
  query: string | null
): UseInfiniteQueryResult<InfiniteData<TPosts, number | null>, Error> => {
  return useInfiniteQuery({
    queryKey: query === null ? [QueryKey.POSTS] : [QueryKey.POSTS, query],
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number | null;
    }): Promise<TPosts> => {
      const url: string = query
        ? `/api/search?cursor=${pageParam}&query=${query}`
        : `/api/posts?cursor=${pageParam}`;

      const response: Response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw result.errors;
      }

      // TODO
      return result;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: TPosts): number | null => {
      return lastPage.data?.nextCursor || null;
    },
  });
};

export default useReadPosts;
