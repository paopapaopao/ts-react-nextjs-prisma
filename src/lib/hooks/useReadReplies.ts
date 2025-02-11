'use client';

import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import type {
  CommentWithRelationsAndRelationCountsAndUserReaction,
  TCommentInfiniteQuery,
} from '../types';

const useReadReplies = (
  comment: CommentWithRelationsAndRelationCountsAndUserReaction
): UseInfiniteQueryResult<
  InfiniteData<TCommentInfiniteQuery, number | null>,
  Error
> => {
  return useInfiniteQuery({
    queryKey: [QueryKey.REPLIES, comment?.postId, comment?.id],
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number | null;
    }): Promise<TCommentInfiniteQuery> => {
      const response = await fetch(
        `/api/posts/${comment?.postId}/comments/${comment?.id}/replies?cursor=${pageParam}`
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

export default useReadReplies;
