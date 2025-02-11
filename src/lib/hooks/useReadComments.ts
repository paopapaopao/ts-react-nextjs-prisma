'use client';

import { type Post, type User } from '@prisma/client';
import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import type {
  TComments,
  PostWithRelationsAndRelationCountsAndUserReaction,
} from '../types';

const useReadComments = (
  post:
    | PostWithRelationsAndRelationCountsAndUserReaction
    | (Post & { user: User })
): UseInfiniteQueryResult<InfiniteData<TComments, number | null>, Error> => {
  return useInfiniteQuery({
    queryKey: [QueryKey.COMMENTS, post?.id],
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number | null;
    }): Promise<TComments> => {
      const response: Response = await fetch(
        `/api/posts/${post?.id}/comments?cursor=${pageParam}`
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

export default useReadComments;
