'use client';

import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { QueryKey } from '../enumerations';
import type { PageParam, PostInfiniteQuery } from '../types';

export const useReadPosts = (
  query: string | null
): UseInfiniteQueryResult<
  InfiniteData<PostInfiniteQuery, number | null>,
  Error
> => {
  return useInfiniteQuery({
    queryKey: query === null ? [QueryKey.POSTS] : [QueryKey.POSTS, query],
    queryFn: async ({ pageParam }: PageParam): Promise<PostInfiniteQuery> => {
      const url = query
        ? `/api/search?cursor=${pageParam}&query=${query}`
        : `/api/posts?cursor=${pageParam}`;

      const response = await fetch(url);
      const result: PostInfiniteQuery = await response.json();

      if (!response.ok && result.errors !== null) {
        throw new Error(Object.values(result.errors).flat().join('. ').trim());
      }

      return result;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage: PostInfiniteQuery): number | null => {
      return lastPage.data?.nextCursor ?? null;
    },
  });
};
