'use client';

import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import type {
  TComments,
  CommentWithRelationsAndRelationCountsAndUserReaction,
} from '../types';

const useReadReplies = (
  comment: CommentWithRelationsAndRelationCountsAndUserReaction
): UseInfiniteQueryResult<InfiniteData<TComments, number | null>, Error> => {
  return useInfiniteQuery({
    queryKey: [QueryKey.REPLIES, comment?.postId, comment?.id],
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number | null;
    }): Promise<TComments> => {
      const response: Response = await fetch(
        `/api/posts/${comment?.postId}/comments/${comment?.id}/replies?cursor=${pageParam}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw result.errors;
      }

      // TODO
      return result;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: TComments): number | null => {
      return lastPage.data?.nextCursor || null;
    },
  });
};

export default useReadReplies;
