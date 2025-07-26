'use client';

import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { QueryKey } from '../enumerations';
import type { PageParam, PostInfiniteQuery } from '../types';

export const useReadPosts = (
  clerkUserId?: string | null,
  query?: string | null
): UseInfiniteQueryResult<
  InfiniteData<PostInfiniteQuery, number | null>,
  Error
> => {
  return useInfiniteQuery({
    queryKey: [QueryKey.POSTS, { clerkUserId, query }],
    queryFn: async ({ pageParam }: PageParam): Promise<PostInfiniteQuery> => {
      const params = new URLSearchParams();

      if (clerkUserId !== undefined && clerkUserId !== null) {
        params.append('clerkUserId', clerkUserId);
      }

      if (query?.trim()) {
        params.append('query', query.trim());
      }

      const response = await fetch(
        `/api/posts?clerkUserId=${clerkUserId}&query=${query}&cursor=${pageParam}`
      );

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
