'use client';

import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { QueryKey } from '../enumerations';
import type { PageParam, PostInfiniteQuery } from '../types';

export const useReadPosts = (
  userId?: number,
  clerkUserId?: string | null,
  query?: string | null
): UseInfiniteQueryResult<
  InfiniteData<PostInfiniteQuery, number | null>,
  Error
> => {
  return useInfiniteQuery({
    queryKey: [QueryKey.POSTS, { userId, clerkUserId, query }],
    queryFn: async ({ pageParam }: PageParam): Promise<PostInfiniteQuery> => {
      const params = new URLSearchParams();
      params.append('cursor', String(pageParam));

      if (userId !== undefined) {
        params.append('userId', String(userId));
      }

      if (clerkUserId !== undefined && clerkUserId !== null) {
        params.append('clerkUserId', clerkUserId);
      }

      if (query !== undefined && query !== null && query.trim() !== '') {
        params.append('query', query.trim());
      }

      const response = await fetch(`/api/posts?${params.toString()}`);
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
