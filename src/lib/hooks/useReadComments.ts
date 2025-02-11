'use client';

import { type Post, type User } from '@prisma/client';
import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import type {
  PostWithRelationsAndRelationCountsAndUserReaction,
  TCommentInfiniteQuery,
} from '../types';

const useReadComments = (
  post:
    | PostWithRelationsAndRelationCountsAndUserReaction
    | (Post & { user: User })
): UseInfiniteQueryResult<
  InfiniteData<TCommentInfiniteQuery, number | null>,
  Error
> => {
  return useInfiniteQuery({
    queryKey: [QueryKey.COMMENTS, post?.id],
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number | null;
    }): Promise<TCommentInfiniteQuery> => {
      const response = await fetch(
        `/api/posts/${post?.id}/comments?cursor=${pageParam}`
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
