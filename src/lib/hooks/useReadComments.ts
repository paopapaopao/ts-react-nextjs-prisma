'use client';

import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import type { TCommentInfiniteQuery, TPageParam } from '../types';

const useReadComments = (
  postId: number | undefined
): UseInfiniteQueryResult<
  InfiniteData<TCommentInfiniteQuery, number | null>,
  Error
> => {
  return useInfiniteQuery({
    queryKey: [QueryKey.COMMENTS, postId],
    queryFn: async ({
      pageParam,
    }: TPageParam): Promise<TCommentInfiniteQuery> => {
      const response = await fetch(
        `/api/posts/${postId}/comments?cursor=${pageParam}`
      );

      const result: TCommentInfiniteQuery = await response.json();

      if (!response.ok && result.errors !== null) {
        throw new Error(Object.values(result.errors).flat().join('. ').trim());
      }

      return result;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage: TCommentInfiniteQuery): number | null => {
      return lastPage.data?.nextCursor ?? null;
    },
  });
};

export default useReadComments;
